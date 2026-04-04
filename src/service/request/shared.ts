// 请求共享方法：提供 Authorization 获取、token 刷新复用、过期请求重试与错误消息去重提示
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
// 刷新 token（调用 refreshToken 接口，成功则更新本地 token，否则重置鉴权状态）
async function handleRefreshToken() {
  // 获取 resetStore 方法（用于刷新失败时退出登录）
  const { resetStore } = useAuthStore();

  // 从本地缓存读取 refreshToken
  const rToken = localStg.get('refreshToken') || '';
  // 调用刷新 token 接口
  const { error, data } = await fetchRefreshToken(rToken);
  // 刷新成功时更新本地缓存并返回 true
  if (!error) {
    // 写入新 token
    localStg.set('token', data.token);
    // 写入新 refreshToken
    localStg.set('refreshToken', data.refreshToken);
    // 返回刷新成功
    return true;
    // !error 分支结束
  }

  // 刷新失败时重置鉴权状态（会清理缓存并跳转登录）
  resetStore();

  // 返回刷新失败
  return false;
}

// 处理 token 过期请求（复用同一个 refreshTokenPromise，刷新成功后由调用方重试请求）
export async function handleExpiredRequest(state: RequestInstanceState) {
  // 没有刷新中的 Promise 时创建一个
  if (!state.refreshTokenPromise) {
    // 写入刷新 Promise，用于并发复用
    state.refreshTokenPromise = handleRefreshToken();
    // if 分支结束
  }

  // 等待刷新结果
  const success = await state.refreshTokenPromise;

  // 延迟清空 refreshTokenPromise，避免极短时间内重复创建
  setTimeout(() => {
    // 清空刷新 Promise
    state.refreshTokenPromise = null;
    // setTimeout 回调结束
  }, 1000);

  // 返回刷新是否成功
  return success;
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
