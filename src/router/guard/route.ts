// 路由权限守卫：负责初始化常量/权限路由、处理登录拦截、角色鉴权与外链跳转等逻辑
import { getRouteName } from '@/router/elegant/transform';
import { useAuthStore } from '@/store/modules/auth';
import { useRouteStore } from '@/store/modules/route';
import { localStg } from '@/utils/storage';
import type { RouteKey, RoutePath } from '@elegant-router/types';
import type { LocationQueryRaw, RouteLocationNormalized, RouteLocationRaw, Router } from 'vue-router';

/**
 * create route guard
 *
 * @param router router instance
 */
// 创建路由守卫（beforeEach 中做路由初始化与登录/权限判断）
export function createRouteGuard(router: Router) {
  // 注册全局 beforeEach 守卫
  router.beforeEach(async (to, from) => {
    // 初始化路由（可能触发路由重定向）
    const location = await initRoute(to);

    // initRoute 返回 location 表示需要重定向
    if (location) {
      // 返回重定向位置给 vue-router
      return location;
      // location 分支结束
    }

    // 获取鉴权 Store（用于读取用户角色与超级角色标记）
    const authStore = useAuthStore();

    // 根路由 key（登录后默认跳转）
    const rootRoute: RouteKey = 'root';
    // 登录路由 key
    const loginRoute: RouteKey = 'login';
    // 无权限路由 key
    const noAuthorizationRoute: RouteKey = '403';

    // 是否已登录（以本地 token 存在为准）
    const isLogin = Boolean(localStg.get('token'));
    // 是否需要登录（非 constant 路由需要登录）
    const needLogin = !to.meta.constant;
    // 当前路由允许访问的角色列表
    const routeRoles = to.meta.roles || [];

    // 是否命中路由角色（用户 roles 与路由 roles 交集不为空）
    const hasRole = authStore.userInfo.roles.some(role => routeRoles.includes(role));
    // 是否有权限（超级角色或路由无 roles 限制或命中角色）
    const hasAuth = authStore.isStaticSuper || !routeRoles.length || hasRole;

    // if it is login route when logged in, then switch to the root page
    // 已登录访问登录页时，直接跳转到 root
    if (to.name === loginRoute && isLogin) {
      // 返回跳转位置
      return { name: rootRoute };
      // if 分支结束
    }

    // if the route does not need login, then it is allowed to access directly
    // 不需要登录的路由允许直接访问
    if (!needLogin) {
      // 处理可能的外链跳转等特殊逻辑
      return handleRouteSwitch(to, from);
      // 显式 return，表示不拦截路由
      // if 分支结束
    }

    // the route need login but the user is not logged in, then switch to the login page
    // 需要登录但未登录时，跳转到登录页并携带 redirect
    if (!isLogin) {
      // 返回登录页位置与重定向 query
      return { name: loginRoute, query: { redirect: to.fullPath } };
      // if 分支结束
    }

    // if the user is logged in but does not have authorization, then switch to the 403 page
    // 已登录但无权限时跳转到 403
    if (!hasAuth) {
      // 返回无权限页位置
      return { name: noAuthorizationRoute };
      // if 分支结束
    }

    // switch route normally
    // 正常放行前处理外链跳转等逻辑
    return handleRouteSwitch(to, from);
    // beforeEach 回调结束
  });
}

/**
 * initialize route
 *
 * @param to to route
 */
// 初始化路由（确保常量/权限路由完成初始化，并处理 not-found 捕获的重定向）
async function initRoute(to: RouteLocationNormalized): Promise<RouteLocationRaw | null> {
  // 获取路由 Store（用于初始化路由与判断路由是否存在）
  const routeStore = useRouteStore();

  // not-found 路由 key
  const notFoundRoute: RouteKey = 'not-found';
  // 是否命中 not-found 路由
  const isNotFoundRoute = to.name === notFoundRoute;

  // if the constant route is not initialized, then initialize the constant route
  // 常量路由未初始化时先初始化
  if (!routeStore.isInitConstantRoute) {
    // 初始化常量路由
    await routeStore.initConstantRoute();

    // the route is captured by the "not-found" route because the constant route is not initialized
    // after the constant route is initialized, redirect to the original route
    // 记录原始目标路径（用于初始化后重定向回去）
    const path = to.fullPath;
    // 构造重定向位置（replace=true 避免历史栈污染）
    const location: RouteLocationRaw = {
      // 重定向 path
      path,
      // 替换当前历史记录
      replace: true,
      // 保留 query
      query: to.query,
      // 保留 hash
      hash: to.hash
      // location 对象结束
    };

    // 返回重定向位置
    return location;
    // if 分支结束
  }

  // 是否已登录（以本地 token 存在为准）
  const isLogin = Boolean(localStg.get('token'));

  // 未登录分支：只允许访问常量路由，其余跳转登录
  if (!isLogin) {
    // if the user is not logged in and the route is a constant route but not the "not-found" route, then it is allowed to access.
    // 未登录且访问常量路由（且不是 not-found）时允许访问
    if (to.meta.constant && !isNotFoundRoute) {
      // 触发未登录路由切换的扩展钩子
      routeStore.onRouteSwitchWhenNotLoggedIn();

      // 返回 null 表示放行
      return null;
      // if 分支结束
    }

    // if the user is not logged in, then switch to the login page
    // 未登录访问非允许路由时跳转登录
    const loginRoute: RouteKey = 'login';
    // 生成登录页 query（可能包含 redirect）
    const query = getRouteQueryOfLoginRoute(to, routeStore.routeHome);

    // 构造登录页重定向位置
    const location: RouteLocationRaw = {
      // 跳转到登录路由
      name: loginRoute,
      // 携带 query
      query
      // location 对象结束
    };

    // 返回重定向位置
    return location;
    // 未登录分支结束
  }

  // 已登录但权限路由未初始化时初始化权限路由
  if (!routeStore.isInitAuthRoute) {
    // initialize the auth route
    // 初始化权限路由（静态/动态由 store 决定）
    await routeStore.initAuthRoute();

    // the route is captured by the "not-found" route because the auth route is not initialized
    // after the auth route is initialized, redirect to the original route
    // 若当前命中 not-found，说明路由在初始化前未注册，需要重定向回原路由
    if (isNotFoundRoute) {
      // root 路由 key
      const rootRoute: RouteKey = 'root';
      // 计算要重定向的 path：若从 root 重定向而来则回到 /，否则保持原 fullPath
      const path = to.redirectedFrom?.name === rootRoute ? '/' : to.fullPath;

      // 构造重定向位置（replace=true 避免历史栈污染）
      const location: RouteLocationRaw = {
        // 重定向 path
        path,
        // 替换当前历史记录
        replace: true,
        // 保留 query
        query: to.query,
        // 保留 hash
        hash: to.hash
        // location 对象结束
      };

      // 返回重定向位置
      return location;
      // isNotFoundRoute 分支结束
    }
    // isInitAuthRoute 分支结束
  }

  // 已登录路由切换扩展钩子
  routeStore.onRouteSwitchWhenLoggedIn();

  // the auth route is initialized
  // it is not the "not-found" route, then it is allowed to access
  // 权限路由已初始化且不是 not-found 时允许访问
  if (!isNotFoundRoute) {
    // 返回 null 表示放行
    return null;
    // if 分支结束
  }

  // it is captured by the "not-found" route, then check whether the route exists
  // 命中 not-found 时判断该 path 对应的权限路由是否存在
  const exist = await routeStore.getIsAuthRouteExist(to.path as RoutePath);
  // 无权限路由 key（用于存在但无权限的情况）
  const noPermissionRoute: RouteKey = '403';

  // 路由存在但被 not-found 捕获，说明用户无权限，跳转到 403
  if (exist) {
    // 构造 403 跳转位置
    const location: RouteLocationRaw = {
      // 跳转到 403
      name: noPermissionRoute
      // location 对象结束
    };

    // 返回重定向位置
    return location;
    // if 分支结束
  }

  // 路由不存在则继续走 not-found（返回 null 表示不处理）
  return null;
}

// 处理路由切换中的特殊逻辑（支持 meta.href 外链打开，并回退到来源路由）
function handleRouteSwitch(to: RouteLocationNormalized, from: RouteLocationNormalized) {
  // route with href
  // 存在 href 时用新窗口打开外链，并阻止当前路由跳转
  if (to.meta.href) {
    // 打开外链
    window.open(to.meta.href, '_blank');

    // 返回回退到来源路由的位置（replace=true 避免历史栈污染）
    return { path: from.fullPath, replace: true, query: from.query, hash: to.hash };
    // if 分支结束
  }
}

// 生成登录页 query（按当前目标路由生成 redirect，并处理首页带 query 的特殊情况）
function getRouteQueryOfLoginRoute(to: RouteLocationNormalized, routeHome: RouteKey) {
  // 登录路由 key
  const loginRoute: RouteKey = 'login';
  // 重定向目标：默认使用当前 fullPath
  const redirect = to.fullPath;
  // 拆分 redirect 的 path 与 query 部分
  const [redirectPath, redirectQuery] = redirect.split('?');
  // 将 path 转为 route name（用于判断是否为首页）
  const redirectName = getRouteName(redirectPath as RoutePath);

  // 是否重定向到首页
  const isRedirectHome = routeHome === redirectName;

  // 非登录页且不是首页重定向时携带 redirect，否则不携带
  const query: LocationQueryRaw = to.name !== loginRoute && !isRedirectHome ? { redirect } : {};

  // 重定向到首页且存在 query 时，将 redirect 修正为 /?xxx
  if (isRedirectHome && redirectQuery) {
    // 写入首页重定向地址（保留 query）
    query.redirect = `/?${redirectQuery}`;
    // if 分支结束
  }

  // 返回登录页 query
  return query;
}
