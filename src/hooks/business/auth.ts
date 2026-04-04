// 权限相关组合式 Hook：提供按钮/功能权限判断能力
import { useAuthStore } from '@/store/modules/auth';

// 获取权限判断方法（中文说明：基于登录状态与用户按钮权限 codes 判断）
export function useAuth() {
  // 获取认证与用户信息状态仓库
  const authStore = useAuthStore();

  // 判断是否拥有指定权限（中文说明：支持单个 code 或 code 数组）
  function hasAuth(codes: string | string[]) {
    // 未登录时直接无权限
    if (!authStore.isLogin) {
      // 返回无权限
      return false;
      // isLogin 判断分支结束
    }

    // 入参为字符串时，判断按钮权限列表是否包含该 code
    if (typeof codes === 'string') {
      // 返回是否包含指定权限 code
      return authStore.userInfo.buttons.includes(codes);
      // typeof 判断分支结束
    }

    // 入参为数组时，只要命中任意一个 code 即视为有权限
    return codes.some(code => authStore.userInfo.buttons.includes(code));
    // hasAuth 函数结束
  }

  // 对外暴露权限判断方法
  return {
    // 权限判断函数
    hasAuth
    // 返回对象定义结束
  };
  // useAuth 函数结束
}
