// 鉴权接口（Alova 版本）：登录、获取用户信息、发送/校验验证码、刷新 token，以及模拟后端错误
import { alova } from '../request';

/**
 * Login
 *
 * @param userName User name
 * @param password Password
 */
// 登录接口（中文说明：提交用户名/密码，返回登录 token 与 refreshToken）
export function fetchLogin(userName: string, password: string) {
  // 发起 POST 请求到 /auth/login
  return alova.Post<Api.Auth.LoginToken>('/auth/login', { userName, password });
  // fetchLogin 函数结束
}

/** Get user info */
// 获取用户信息接口（中文说明：返回当前登录用户的基础信息/角色/按钮权限）
export function fetchGetUserInfo() {
  // 发起 GET 请求到 /auth/getUserInfo
  return alova.Get<Api.Auth.UserInfo>('/auth/getUserInfo');
  // fetchGetUserInfo 函数结束
}

/** Send captcha to target phone */
// 发送验证码接口（中文说明：向指定手机号发送验证码）
export function sendCaptcha(phone: string) {
  // 发起 POST 请求到 /auth/sendCaptcha
  return alova.Post<null>('/auth/sendCaptcha', { phone });
  // sendCaptcha 函数结束
}

/** Verify captcha */
// 校验验证码接口（中文说明：校验手机号与验证码是否匹配）
export function verifyCaptcha(phone: string, code: string) {
  // 发起 POST 请求到 /auth/verifyCaptcha
  return alova.Post<null>('/auth/verifyCaptcha', { phone, code });
  // verifyCaptcha 函数结束
}

/**
 * Refresh token
 *
 * @param refreshToken Refresh token
 */
// 刷新 token 接口（中文说明：标记 authRole=refreshToken，避免刷新请求被拦截）
export function fetchRefreshToken(refreshToken: string) {
  // 发起 POST 请求到 /auth/refreshToken，并注入 meta.authRole
  return alova.Post<Api.Auth.LoginToken>(
    '/auth/refreshToken',
    { refreshToken },
    {
      meta: {
        authRole: 'refreshToken'
      }
    }
  );
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
  // 发起 GET 请求到 /auth/error，并关闭 shareRequest 避免共享请求缓存
  return alova.Get('/auth/error', {
    params: { code, msg },
    shareRequest: false
  });
  // fetchCustomBackendError 函数结束
}
