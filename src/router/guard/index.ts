// 路由守卫入口：统一注册进度条、权限路由与标题更新等守卫
import type { Router } from 'vue-router';
import { createRouteGuard } from './route';
import { createProgressGuard } from './progress';
import { createDocumentTitleGuard } from './title';

/**
 * Router guard
 *
 * @param router - Router instance
 */
// 注册所有路由守卫（按顺序挂载进度条、路由权限与标题守卫）
export function createRouterGuard(router: Router) {
  // 注册路由切换进度条守卫
  createProgressGuard(router);
  // 注册路由权限/初始化守卫
  createRouteGuard(router);
  // 注册文档标题更新守卫
  createDocumentTitleGuard(router);
}
