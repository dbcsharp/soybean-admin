// Alova 请求实例：配置 baseURL、请求适配器（mock/fetch）、鉴权头注入、token 过期刷新与统一错误处理
import { createAlovaRequest } from '@sa/alova';
import { createAlovaMockAdapter } from '@sa/alova/mock';
import adapterFetch from '@sa/alova/fetch';
import { useAuthStore } from '@/store/modules/auth';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import featureUsers20241014 from '../mocks/feature-users-20241014';
import { getAuthorization, handleRefreshToken, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

// 是否启用本地代理（仅开发环境且 VITE_HTTP_PROXY=Y 时启用）
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
// 根据环境与代理开关计算默认服务 baseURL
const { baseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

// 请求实例共享状态（用于错误提示去重）
const state: RequestInstanceState = {
  // 错误消息栈
  errMsgStack: []
  // state 对象结束
};
// mock 适配器（命中 mock 时返回 mock 响应，未命中则走 fetch）
const mockAdapter = createAlovaMockAdapter([featureUsers20241014], {
  // 未命中 mock 时使用 fetch 适配器
  httpAdapter: adapterFetch(),

  // mock 响应延迟（毫秒）
  delay: 1000,

  // 全局 mock 开关
  enable: true,
  // mock 匹配模式（方法+URL）
  matchMode: 'methodurl'
  // mockAdapter 配置对象结束
});
// 创建 Alova 请求实例（统一处理鉴权头、后端成功判断、token 刷新与错误提示）
export const alova = createAlovaRequest(
  {
    // 服务 baseURL
    baseURL,
    // 请求适配器：开发环境优先使用 mockAdapter，否则使用 fetch
    requestAdapter: import.meta.env.DEV ? mockAdapter : adapterFetch()
  },
  {
    // 请求发送前处理（注入 Authorization 与 apifoxToken）
    onRequest({ config }) {
      // 获取 Authorization 头
      const Authorization = getAuthorization();
      // 写入 Authorization
      config.headers.Authorization = Authorization;
      // 写入 Apifox Token（用于接口调试场景）
      config.headers.apifoxToken = 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2';
      // onRequest 回调结束
    },
    // token 刷新器配置（命中 token 过期错误码时自动刷新 token）
    tokenRefresher: {
      // 判断是否 token 过期
      async isExpired(response) {
        // 从环境变量读取过期错误码列表
        const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
        // 读取响应 code
        const { code } = await response.clone().json();
        // 返回是否命中过期错误码
        return expiredTokenCodes.includes(String(code));
        // isExpired 回调结束
      },
      // 过期处理：刷新 token
      async handler() {
        // 执行刷新 token
        await handleRefreshToken();
        // handler 回调结束
      }
      // tokenRefresher 对象结束
    },
    // 判断后端是否成功（按 VITE_SERVICE_SUCCESS_CODE 比较 response.code）
    async isBackendSuccess(response) {
      // 后端响应码为 "0000"（默认）时视为成功，可通过 .env 中 VITE_SERVICE_SUCCESS_CODE 调整
      // 克隆响应，避免读取 body 后影响后续流程
      const resp = response.clone();
      // 读取响应 JSON
      const data = await resp.json();
      // 返回是否为成功 code
      return String(data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
      // isBackendSuccess 回调结束
    },
    // 转换后端响应（提取响应中的 data 字段作为最终数据）
    async transformBackendResponse(response) {
      // 返回响应 data 字段
      return (await response.clone().json()).data;
      // transformBackendResponse 回调结束
    },
    // 统一错误处理（处理登出码/弹窗登出码，并做错误提示去重）
    async onError(error, response) {
      // 获取鉴权 Store（用于触发 resetStore）
      const authStore = useAuthStore();

      // 默认错误消息
      let message = error.message;
      // 后端响应码字符串
      let responseCode = '';
      // 存在响应时从响应中提取 msg/code
      if (response) {
        // 读取响应 JSON
        const data = await response?.clone().json();
        // 后端消息
        message = data.msg;
        // 后端 code
        responseCode = String(data.code);
        // if 分支结束
      }

      // 登出处理（先提示错误，再重置鉴权状态）
      function handleLogout() {
        // 提示错误消息（去重）
        showErrorMsg(state, message);
        // 重置鉴权状态（会清理缓存并跳转登录）
        authStore.resetStore();
      }

      // 登出并清理（移除 beforeunload 防刷新拦截，并清理消息栈中的当前消息）
      function logoutAndCleanup() {
        // 执行登出
        handleLogout();
        // 移除防刷新拦截
        window.removeEventListener('beforeunload', handleLogout);
        // 从消息栈移除当前消息
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);
      }

      // 命中 logoutCodes 时直接登出并跳转登录页
      // 需要直接登出的错误码列表（来自环境变量）
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      // 命中登出码则直接登出并抛出错误
      if (logoutCodes.includes(responseCode)) {
        // 执行登出
        handleLogout();
        // 抛出错误终止调用链
        throw error;
        // if 分支结束
      }

      // 命中 modalLogoutCodes 时弹窗提示并登出
      // 需要弹窗提示并登出的错误码列表（来自环境变量）
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      // 命中弹窗登出码且当前消息未在栈中时弹窗提示
      if (modalLogoutCodes.includes(responseCode) && !state.errMsgStack?.includes(message)) {
        // 将当前消息加入错误栈，避免重复弹窗
        state.errMsgStack = [...(state.errMsgStack || []), message];

        // 防止用户刷新页面绕过登出弹窗
        window.addEventListener('beforeunload', handleLogout);

        // 弹出错误对话框提示，并在确认/关闭时登出并清理
        window.$dialog?.error({
          // 弹窗标题
          title: $t('common.error'),
          // 弹窗内容
          content: message,
          // 确认按钮文案
          positiveText: $t('common.confirm'),
          // 禁止点击遮罩关闭
          maskClosable: false,
          // 禁止 ESC 关闭
          closeOnEsc: false,
          // 点击确认时登出并清理
          onPositiveClick() {
            // 执行登出并清理
            logoutAndCleanup();
            // onPositiveClick 回调结束
          },
          // 关闭弹窗时登出并清理
          onClose() {
            // 执行登出并清理
            logoutAndCleanup();
            // onClose 回调结束
          }
          // dialog 配置对象结束
        });
        // 抛出错误终止调用链
        throw error;
        // if 分支结束
      }
      // 默认错误提示（去重）
      showErrorMsg(state, message);
      // 将错误继续抛出
      throw error;
      // onError 回调结束
    }
  }
);
