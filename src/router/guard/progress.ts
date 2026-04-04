// 进度条守卫：在路由切换前后触发 NProgress 的 start/done
import type { Router } from 'vue-router';

// 创建进度条守卫（beforeEach 开始进度条，afterEach 结束进度条）
export function createProgressGuard(router: Router) {
  // 路由跳转前启动进度条
  router.beforeEach(() => {
    // 兼容可选链调用
    window.NProgress?.start?.();
    // 显式 return，表示不拦截路由
    return;
    // beforeEach 回调结束
  });
  // 路由跳转后结束进度条
  router.afterEach(() => {
    // 兼容可选链调用
    window.NProgress?.done?.();
    // afterEach 回调结束
  });
}
