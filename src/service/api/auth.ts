// 鉴权接口：登录、获取用户信息、刷新 token，以及模拟后端错误
import { request } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
// 登录接口（中文说明：提交用户名/密码，返回登录 token 与 refreshToken）
export function fetchLogin(userName: string, password: string) {
  // 发起 POST 请求到 /auth/login
  return request<Api.Auth.LoginToken>({
    // 接口地址
    url: '/auth/login',
    // 请求方法
    method: 'post',
    // 请求体数据
    data: {
      // 用户名
      userName,
      // 密码
      password
      // data 对象结束
    }
    // request 配置对象结束
  });
  // fetchLogin 函数结束
}

/** Get user info */
// 获取用户信息接口（中文说明：返回当前登录用户的基础信息/角色/按钮权限）
export function fetchGetUserInfo() {
  // 发起请求到 /auth/getUserInfo
  return request<Api.Auth.UserInfo>({ url: '/auth/getUserInfo' });
  // fetchGetUserInfo 函数结束
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
// 刷新 token 接口（中文说明：提交 refreshToken，返回新的 token 与 refreshToken）
export function fetchRefreshToken(refreshToken: string) {
  // 发起 POST 请求到 /auth/refreshToken
  return request<Api.Auth.LoginToken>({
    // 接口地址
    url: '/auth/refreshToken',
    // 请求方法
    method: 'post',
    // 请求体数据
    data: {
      // 刷新 token
      refreshToken
      // data 对象结束
    }
    // request 配置对象结束
  });
  // fetchRefreshToken 函数结束
}

/**
 * return custom backend error
 *
 * @param code error code
 * @param msg error message
 */
// 模拟后端错误接口（中文说明：通过 query params 传入 code/msg，用于演示错误处理）
export function fetchCustomBackendError(code: string, msg: string) {
  // 发起请求到 /auth/error 并携带 code/msg 参数
  return request({ url: '/auth/error', params: { code, msg } });
  // fetchCustomBackendError 函数结束
}
