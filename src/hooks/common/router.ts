// Router 组合式 Hook：封装常用路由跳转能力（按 RouteKey 跳转、带 meta query 跳转、登录相关跳转与回跳）
import { useRouter } from 'vue-router';
import type { RouteLocationRaw } from 'vue-router';
import type { RouteKey } from '@elegant-router/types';
import { router as globalRouter } from '@/router';

/**
 * 路由跳转封装（统一 setup/非 setup 两种使用场景，避免在 setup 外误用 useRouter）
 * Router push
 *
 * Jump to the specified route, it can replace function router.push
 *
 * @param inSetup 是否在 Vue script setup / setup 上下文中使用（默认 true）
 * @param inSetup Whether is in vue script setup
 */
export function useRouterPush(inSetup = true) {
  // 根据是否处于 setup 环境选择 router 实例来源
  const router = inSetup ? useRouter() : globalRouter;
  // 获取全局当前路由引用（用于读取 query / fullPath 等信息）
  const route = globalRouter.currentRoute;

  // 缓存 push 方法，便于对外直接暴露
  const routerPush = router.push;

  // 缓存 back 方法，便于对外直接暴露
  const routerBack = router.back;

  // 通过 RouteKey 跳转（支持传入 query 与 params 组装 RouteLocationRaw）
  async function routerPushByKey(key: RouteKey, options?: App.Global.RouterPushOptions) {
    // 读取 query 与 params（未传 options 时使用空对象兜底）
    const { query, params } = options || {};

    // 构造基于 name 的路由位置对象
    const routeLocation: RouteLocationRaw = {
      // 使用路由 name（RouteKey）定位目标路由
      name: key
      // routeLocation 基础结构结束
    };

    // 当 query 不为空对象时才写入，避免生成多余的空 query
    if (Object.keys(query || {}).length) {
      // 写入 query 参数
      routeLocation.query = query;
      // query 分支结束
    }

    // 当 params 不为空对象时才写入，避免生成多余的空 params
    if (Object.keys(params || {}).length) {
      // 写入 params 参数
      routeLocation.params = params;
      // params 分支结束
    }

    // 执行实际跳转并返回 Promise
    return routerPush(routeLocation);
  }

  // 通过 RouteKey 跳转，并自动把目标路由 meta.query 写入到 query 中
  function routerPushByKeyWithMetaQuery(key: RouteKey) {
    // 获取路由表（用于查找目标路由的 meta 配置）
    const allRoutes = router.getRoutes();
    // 查找目标路由的 meta 信息（找不到时置为 null）
    const meta = allRoutes.find(item => item.name === key)?.meta || null;

    // 初始化 query 容器（用于收集 meta.query 的键值对）
    const query: Record<string, string> = {};

    // 将 meta.query 中配置的键值对写入 query（支持可选链，避免 meta 为空时报错）
    meta?.query?.forEach(item => {
      // 写入单个 query 项
      query[item.key] = item.value;
      // forEach 单次迭代结束
    });

    // 携带组装后的 query 执行跳转
    return routerPushByKey(key, { query });
  }

  // 跳转到首页（封装 root 路由的快捷入口）
  async function toHome() {
    // 通过 root RouteKey 跳转到首页
    return routerPushByKey('root');
  }

  /**
   * 跳转到登录页（可指定登录模块，并可携带 redirect 回跳地址）
   * Navigate to login page
   *
   * @param loginModule 登录模块（不传则默认 pwd-login）
   * @param loginModule The login module
   * @param redirectUrl 回跳地址（不传则使用当前路由 fullPath）
   * @param redirectUrl The redirect url, if not specified, it will be the current route fullPath
   */
  async function toLogin(loginModule?: UnionKey.LoginModule, redirectUrl?: string) {
    // 选择登录模块（未传则默认使用密码登录模块）
    const module = loginModule || 'pwd-login';

    // 组装跳转参数（先写入 params.module）
    const options: App.Global.RouterPushOptions = {
      // params 作为路由参数传递
      params: {
        // 写入登录模块参数
        module
        // params 对象结束
      }
      // options 初始结构结束
    };

    // 计算 redirect 地址（优先使用外部传入，否则使用当前路由 fullPath）
    const redirect = redirectUrl || route.value.fullPath;

    // 写入 query.redirect 供登录后回跳使用
    options.query = {
      // 写入回跳地址
      redirect
      // query 对象结束
    };

    // 执行跳转到 login 路由
    return routerPushByKey('login', options);
  }

  /**
   * 切换登录模块（保留当前 query，并覆盖 params.module）
   * Toggle login module
   *
   * @param module
   */
  async function toggleLoginModule(module: UnionKey.LoginModule) {
    // 读取当前路由 query（强转为字符串键值对）
    const query = route.value.query as Record<string, string>;

    // 携带当前 query 与新的 module params 跳转到 login
    return routerPushByKey('login', { query, params: { module } });
  }

  /**
   * 登录后重定向（优先按 query.redirect 回跳，否则跳转首页）
   * Redirect from login
   *
   * @param [needRedirect=true] 是否需要重定向（默认 true）
   * @param [needRedirect=true] Whether to redirect after login. Default is `true`
   */
  async function redirectFromLogin(needRedirect = true) {
    // 从当前路由 query 中读取 redirect 参数
    const redirect = route.value.query?.redirect as string;

    // 需要重定向且 redirect 存在时，跳转到 redirect 指定地址
    if (needRedirect && redirect) {
      // 使用 routerPush 直接跳转到字符串路径
      await routerPush(redirect);
    } else {
      // 不重定向或没有 redirect 时回到首页
      await toHome();
      // needRedirect 条件分支结束
    }
  }

  // 对外暴露常用路由操作方法
  return {
    // 路由 push 方法
    routerPush,
    // 路由 back 方法
    routerBack,
    // 通过 RouteKey 跳转的方法
    routerPushByKey,
    // 从 meta.query 生成 query 后跳转的方法
    routerPushByKeyWithMetaQuery,
    // 跳转到登录页的方法
    toLogin,
    // 切换登录模块的方法
    toggleLoginModule,
    // 登录后重定向的方法
    redirectFromLogin
    // 返回对象定义结束
  };
}
