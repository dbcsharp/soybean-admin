// 请求实例：创建主请求（createFlatRequest）与示例请求（createRequest），并封装鉴权头、错误处理与 token 过期重试
import type { AxiosResponse } from 'axios';
import { BACKEND_ERROR_CODE, createFlatRequest, createRequest } from '@sa/axios';
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { getServiceBaseURL } from '@/utils/service';
import { $t } from '@/locales';
import { getAuthorization, handleExpiredRequest, showErrorMsg } from './shared';
import type { RequestInstanceState } from './type';

// 是否启用本地代理（中文说明：仅开发环境且 VITE_HTTP_PROXY=Y 时启用）
const isHttpProxy = import.meta.env.DEV && import.meta.env.VITE_HTTP_PROXY === 'Y';
// 根据环境与代理开关计算默认服务 baseURL 与其他服务 baseURL
const { baseURL, otherBaseURL } = getServiceBaseURL(import.meta.env, isHttpProxy);

// 主请求实例（中文说明：用于业务接口请求，统一处理 token、后端错误码与自动刷新 token）
export const request = createFlatRequest(
  // 请求基础配置
  {
    // 默认服务 baseURL
    baseURL,
    // 默认请求头
    headers: {
      // Apifox 调试 token（用于接口调试场景）
      apifoxToken: 'XL299LiMEDZ0H5h3A29PxwQXdMJqWyY2'
      // headers 对象结束
    }
    // 基础配置对象结束
  },
  // 请求实例行为配置
  {
    // 默认实例状态（用于错误去重与刷新 token 复用）
    defaultState: {
      // 错误消息栈
      errMsgStack: [],
      // 刷新 token Promise（并发复用）
      refreshTokenPromise: null
      // defaultState 对象结束
    } as RequestInstanceState,
    // 响应转换（中文说明：从后端响应结构中提取 data.data）
    transform(response: AxiosResponse<App.Service.Response<any>>) {
      // 返回业务数据
      return response.data.data;
      // transform 函数结束
    },
    // 请求发送前处理（中文说明：注入 Authorization 请求头）
    async onRequest(config) {
      // 获取 Authorization 头
      const Authorization = getAuthorization();
      // 合并写入请求头
      Object.assign(config.headers, { Authorization });

      // 返回处理后的 config
      return config;
      // onRequest 函数结束
    },
    // 判断后端是否成功（中文说明：按 VITE_SERVICE_SUCCESS_CODE 比较 response.data.code）
    isBackendSuccess(response) {
      // 后端响应码为 "0000"（默认）时视为成功，可通过 .env 中 VITE_SERVICE_SUCCESS_CODE 调整
      // 对 code 做字符串化比较，避免 number/string 类型差异
      return String(response.data.code) === import.meta.env.VITE_SERVICE_SUCCESS_CODE;
      // isBackendSuccess 函数结束
    },
    // 后端业务失败处理（中文说明：处理登出码、弹窗登出码、过期码刷新 token 并重试）
    async onBackendFail(response, instance) {
      // 获取鉴权 Store（用于触发 resetStore 登出）
      const authStore = useAuthStore();
      // 将后端错误码转为字符串便于比较
      const responseCode = String(response.data.code);

      // 执行登出（中文说明：重置鉴权状态）
      function handleLogout() {
        // 重置鉴权状态并跳转登录等
        authStore.resetStore();
        // handleLogout 函数结束
      }

      // 登出并清理（中文说明：移除 beforeunload 防刷新拦截，并从 errMsgStack 移除当前消息）
      function logoutAndCleanup() {
        // 执行登出
        handleLogout();
        // 移除防刷新拦截
        window.removeEventListener('beforeunload', handleLogout);

        // 清理错误消息栈中的当前消息，避免重复弹窗
        request.state.errMsgStack = request.state.errMsgStack.filter(msg => msg !== response.data.msg);
        // logoutAndCleanup 函数结束
      }

      // 命中 logoutCodes 时直接登出并跳转登录页
      // 需要直接登出的错误码列表（来自环境变量）
      const logoutCodes = import.meta.env.VITE_SERVICE_LOGOUT_CODES?.split(',') || [];
      // 命中登出码则直接登出并终止本次处理
      if (logoutCodes.includes(responseCode)) {
        // 触发登出
        handleLogout();
        // 返回 null 表示不重试
        return null;
        // if 分支结束
      }

      // 命中 modalLogoutCodes 时弹窗提示并登出
      // 需要弹窗提示并登出的错误码列表（来自环境变量）
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      // 命中弹窗登出码且当前消息未在栈中时弹窗提示
      if (modalLogoutCodes.includes(responseCode) && !request.state.errMsgStack?.includes(response.data.msg)) {
        // 将当前消息加入错误栈，避免重复弹窗
        request.state.errMsgStack = [...(request.state.errMsgStack || []), response.data.msg];

        // 防止用户刷新页面绕过登出弹窗
        window.addEventListener('beforeunload', handleLogout);

        // 弹出错误对话框提示，并在确认/关闭时登出并清理
        window.$dialog?.error({
          // 弹窗标题
          title: $t('common.error'),
          // 弹窗内容
          content: response.data.msg,
          // 确认按钮文本
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

        // 返回 null 表示不重试
        return null;
        // if 分支结束
      }

      // 命中 expiredTokenCodes 时视为 token 过期：刷新 token 并重试请求（刷新接口不应再返回过期码以避免死循环）
      // token 过期错误码列表（来自环境变量）
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      // 命中过期码则刷新 token，并在成功后重试原请求
      if (expiredTokenCodes.includes(responseCode)) {
        // 处理过期请求（内部会复用刷新 Promise）
        const success = await handleExpiredRequest(request.state);
        // 刷新成功时重试请求
        if (success) {
          // 获取新的 Authorization 头
          const Authorization = getAuthorization();
          // 覆盖写入原请求配置的 headers
          Object.assign(response.config.headers, { Authorization });

          // 使用原请求配置重试
          return instance.request(response.config) as Promise<AxiosResponse>;
          // success 分支结束
        }
        // expiredTokenCodes 分支结束
      }

      // 返回 null 表示不做额外处理
      return null;
      // onBackendFail 函数结束
    },
    // 网络/请求异常处理（中文说明：按错误码决定是否提示，避免与弹窗登出/过期重试冲突）
    onError(error) {
      // 请求失败时可在此统一提示错误消息

      // 默认错误消息使用 error.message
      let message = error.message;
      // 后端错误码字符串（用于与环境变量错误码比较）
      let backendErrorCode = '';

      // 获取后端错误消息与错误码
      // 当错误来源于后端业务错误时，从响应中提取 msg 与 code
      if (error.code === BACKEND_ERROR_CODE) {
        // 使用后端 msg 作为提示
        message = error.response?.data?.msg || message;
        // 提取后端 code
        backendErrorCode = String(error.response?.data?.code || '');
        // if 分支结束
      }

      // 弹窗登出错误码：错误信息已由弹窗展示，这里不再重复提示
      // 弹窗登出错误码：由弹窗处理，这里不再提示
      const modalLogoutCodes = import.meta.env.VITE_SERVICE_MODAL_LOGOUT_CODES?.split(',') || [];
      // 命中弹窗登出码则直接返回
      if (modalLogoutCodes.includes(backendErrorCode)) {
        // 直接返回不提示
        return;
        // if 分支结束
      }

      // token 过期错误码：会走刷新与重试，这里不提示错误
      // token 过期错误码：会走刷新与重试，这里不提示
      const expiredTokenCodes = import.meta.env.VITE_SERVICE_EXPIRED_TOKEN_CODES?.split(',') || [];
      // 命中过期码则直接返回
      if (expiredTokenCodes.includes(backendErrorCode)) {
        // 直接返回不提示
        return;
        // if 分支结束
      }

      // 非上述情况则按去重策略展示错误消息
      showErrorMsg(request.state, message);
      // onError 函数结束
    }
    // createFlatRequest 配置对象结束
  }
  // createFlatRequest 调用结束
);

// 示例请求实例（中文说明：用于 demo 服务示例，演示 createRequest 的使用方式）
export const demoRequest = createRequest(
  // 请求基础配置
  {
    // demo 服务 baseURL
    baseURL: otherBaseURL.demo
    // 基础配置对象结束
  },
  // 请求实例行为配置
  {
    // 响应转换（中文说明：提取 demoResponse.result）
    transform(response: AxiosResponse<App.Service.DemoResponse>) {
      // 返回 result 数据
      return response.data.result;
      // transform 函数结束
    },
    // 请求发送前处理（中文说明：从本地读取 token 并设置 Authorization）
    async onRequest(config) {
      // 解构 headers
      const { headers } = config;

      // set token
      // 从本地缓存读取 token
      const token = localStg.get('token');
      // 拼接 Bearer Token（token 不存在则为 null）
      const Authorization = token ? `Bearer ${token}` : null;
      // 合并写入请求头
      Object.assign(headers, { Authorization });

      // 返回处理后的 config
      return config;
      // onRequest 函数结束
    },
    // 判断后端是否成功（中文说明：demo 服务以 status==="200" 作为成功）
    isBackendSuccess(response) {
      // 后端响应码为 "200" 时视为成功（示例逻辑，可按实际后端约定调整）
      // 返回 demo 服务成功判断
      return response.data.status === '200';
      // isBackendSuccess 函数结束
    },
    // demo 服务后端失败处理（中文说明：示例占位，可实现刷新 token 等逻辑）
    async onBackendFail(_response) {
      // 后端响应码非 "200" 时视为失败（示例：可在此处理 token 过期刷新并重试等）
      // 当前暂无实现
      // onBackendFail 函数结束
    },
    // demo 服务错误处理（中文说明：提取后端 message 并提示）
    onError(error) {
      // 请求失败时可在此统一提示错误消息（示例逻辑）

      // 默认错误消息使用 error.message
      let message = error.message;

      // 当错误来源于后端业务错误时，优先显示后端 message
      // 当错误来源于后端业务错误时，从响应中提取 message
      if (error.code === BACKEND_ERROR_CODE) {
        // 使用后端 message 作为提示
        message = error.response?.data?.message || message;
        // if 分支结束
      }

      // 弹出错误提示
      window.$message?.error(message);
      // onError 函数结束
    }
    // createRequest 配置对象结束
  }
  // createRequest 调用结束
);
