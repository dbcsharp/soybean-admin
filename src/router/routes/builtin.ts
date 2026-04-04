// 内置路由：提供 root 与 not-found 等必须在 Router 初始化阶段注册的常量路由
import type { CustomRoute } from '@elegant-router/types';
import { layouts, views } from '../elegant/imports';
import { getRoutePath, transformElegantRoutesToVueRoutes } from '../elegant/transform';

// 根路由（默认重定向到 VITE_ROUTE_HOME 对应路径）
export const ROOT_ROUTE: CustomRoute = {
  // 路由 name
  name: 'root',
  // 路由 path
  path: '/',
  // 重定向路径：优先用 routeHome 的 path，否则回退到 /home
  redirect: getRoutePath(import.meta.env.VITE_ROUTE_HOME) || '/home',
  // 路由 meta（常量路由，无需登录）
  meta: {
    // 标题
    title: 'root',
    // 标记为常量路由
    constant: true
    // meta 对象结束
  }
  // ROOT_ROUTE 对象结束
};

// 兜底 404 路由（匹配所有未命中的路径）
const NOT_FOUND_ROUTE: CustomRoute = {
  // 路由 name
  name: 'not-found',
  // 路由 path（pathMatch 捕获所有路径）
  path: '/:pathMatch(.*)*',
  // 使用空白布局下的 404 页面
  component: 'layout.blank$view.404',
  // 路由 meta（常量路由，无需登录）
  meta: {
    // 标题
    title: 'not-found',
    // 标记为常量路由
    constant: true
    // meta 对象结束
  }
  // NOT_FOUND_ROUTE 对象结束
};

/** builtin routes, it must be constant and setup in vue-router */
// 内置常量路由数组（必须在 createRouter 时传入）
const builtinRoutes: CustomRoute[] = [ROOT_ROUTE, NOT_FOUND_ROUTE];

/** create builtin vue routes */
// 创建内置 Vue Router 路由记录（将 Elegant 路由转换为 vue-router routes）
export function createBuiltinVueRoutes() {
  // 将内置路由转换为 vue-router 路由数组
  return transformElegantRoutesToVueRoutes(builtinRoutes, layouts, views);
}
