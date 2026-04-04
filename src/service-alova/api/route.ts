// 路由接口（Alova 版本）：获取常量路由、用户路由与路由存在性判断
import { alova } from '../request';

/** get constant routes */
// 获取常量路由（返回无需权限的路由列表）
export function fetchGetConstantRoutes() {
  // 发起 GET 请求到 /route/getConstantRoutes
  return alova.Get<Api.Route.MenuRoute[]>('/route/getConstantRoutes');
}

/** get user routes */
// 获取用户路由（返回当前用户可访问的路由与首页 home 配置）
export function fetchGetUserRoutes() {
  // 发起 GET 请求到 /route/getUserRoutes
  return alova.Get<Api.Route.UserRoute>('/route/getUserRoutes');
}

/**
 * whether the route is exist
 *
 * @param routeName route name
 */
// 判断路由是否存在（用于 not-found 捕获时判断是否为“存在但无权限”的路由）
export function fetchIsRouteExist(routeName: string) {
  // 发起 GET 请求到 /route/isRouteExist 并携带 routeName 参数
  return alova.Get<boolean>('/route/isRouteExist', { params: { routeName } });
}
