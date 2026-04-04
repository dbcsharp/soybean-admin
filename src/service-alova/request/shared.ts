// 请求共享方法（Alova 版本）：提供 Authorization 获取、刷新 token、以及错误消息去重提示
import { useAuthStore } from '@/store/modules/auth';
import { localStg } from '@/utils/storage';
import { fetchRefreshToken } from '../api';
import type { RequestInstanceState } from './type';

// 获取 Authorization 头（从本地 token 生成 Bearer Token）
export function getAuthorization() {
  // 从本地缓存读取 token
  const token = localStg.get('token');
  // token 存在则拼接 Bearer，否则返回 null
  const Authorization = token ? `Bearer ${token}` : null;

  // 返回 Authorization
  return Authorization;
}

/** refresh token */
// 刷新 token（调用 refreshToken 接口，成功则更新本地 token，否则重置鉴权状态并抛出错误）
export async function handleRefreshToken() {
  // 获取 resetStore 方法（用于刷新失败时退出登录）
  const { resetStore } = useAuthStore();

  // 从本地缓存读取 refreshToken
  const rToken = localStg.get('refreshToken') || '';
  // 构造刷新 token 的请求方法
  const refreshTokenMethod = fetchRefreshToken(rToken);

  // set the refreshToken role, so that the request will not be intercepted
  // 标记请求角色为 refreshToken，避免被鉴权拦截逻辑二次处理
  refreshTokenMethod.meta.authRole = 'refreshToken';

  // 捕获刷新过程的异常，失败时登出并抛出错误
  try {
    // 执行刷新 token 请求
    const data = await refreshTokenMethod;
    // 写入新 token
    localStg.set('token', data.token);
    // 写入新 refreshToken
    localStg.set('refreshToken', data.refreshToken);
  } catch (error) {
    // 刷新失败时重置鉴权状态（会清理缓存并跳转登录）
    resetStore();
    // 将错误继续抛出，交由调用方处理
    throw error;
    // catch 分支结束
  }
}

// 展示错误消息（使用 errMsgStack 去重，避免短时间重复弹出同一错误）
export function showErrorMsg(state: RequestInstanceState, message: string) {
  // errMsgStack 不存在时初始化为空数组
  if (!state.errMsgStack?.length) {
    // 初始化 errMsgStack
    state.errMsgStack = [];
    // if 分支结束
  }

  // 判断该消息是否已存在于消息栈中
  const isExist = state.errMsgStack.includes(message);

  // 未存在时才推入并提示
  if (!isExist) {
    // 推入消息栈，用于去重
    state.errMsgStack.push(message);

    // 弹出错误提示，离开时移除消息并延迟清空栈
    window.$message?.error(message, {
      // 消息离开回调（用于清理消息栈）
      onLeave: () => {
        // 移除当前消息
        state.errMsgStack = state.errMsgStack.filter(msg => msg !== message);

        // 延迟清空消息栈，避免栈长期增长
        setTimeout(() => {
          // 清空消息栈
          state.errMsgStack = [];
          // setTimeout 回调结束
        }, 5000);
        // onLeave 回调结束
      }
      // error 配置对象结束
    });
    // if 分支结束
  }
}
