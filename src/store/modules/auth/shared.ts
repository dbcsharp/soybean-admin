import { localStg } from '@/utils/storage';

/** Get token */
// 获取当前登录 token（从本地存储读取 token，不存在则返回空字符串）
export function getToken() {
  // 从 localStg 读取 token，并用空字符串兜底
  return localStg.get('token') || '';
}

/** Clear auth storage */
// 清理鉴权相关缓存（移除 token 与 refreshToken）
export function clearAuthStorage() {
  // 移除 token
  localStg.remove('token');
  // 移除刷新 token
  localStg.remove('refreshToken');
}
