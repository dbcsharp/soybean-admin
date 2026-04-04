// elegant-router 插件配置：定义布局映射、自定义路由名称、路由路径转换与默认 meta 生成规则
import type { RouteMeta } from 'vue-router';
import ElegantVueRouter from '@elegant-router/vue/vite';
import type { RouteKey } from '@elegant-router/types';

// 创建 elegant-router 插件（扫描约定目录生成 routes/imports/transform 等文件）
export function setupElegantRouter() {
  // 返回 Vite 插件实例
  return ElegantVueRouter({
    // 布局组件映射（layout key -> 组件路径）
    layouts: {
      // base 布局
      base: 'src/layouts/base-layout/index.vue',
      // blank 布局
      blank: 'src/layouts/blank-layout/index.vue'
    },
    // 自定义路由名称（用于排除/覆盖自动生成的命名）
    customRoutes: {
      // 自定义路由 name 列表
      names: [
        'exception_403',
        'exception_404',
        'exception_500',
        'document_project',
        'document_project-link',
        'document_video',
        'document_vue',
        'document_vite',
        'document_unocss',
        'document_naive',
        'document_pro-naive',
        'document_antd',
        'document_alova'
      ]
    },
    // 路由路径转换器（可按路由 name 自定义 path 规则）
    routePathTransformer(routeName, routePath) {
      // 将 routeName 强转为 RouteKey
      const key = routeName as RouteKey;

      // 登录路由支持可选的 module 参数（pwd-login/code-login/register/reset-pwd/bind-wechat）
      if (key === 'login') {
        // 支持的登录模块列表
        const modules: UnionKey.LoginModule[] = ['pwd-login', 'code-login', 'register', 'reset-pwd', 'bind-wechat'];

        // 构造模块正则（pwd-login|code-login|...）
        const moduleReg = modules.join('|');

        // 返回带可选参数的登录路由 path
        return `/login/:module(${moduleReg})?`;
      }

      // 其它路由保持默认 path
      return routePath;
      // routePathTransformer 回调结束
    },
    // 生成默认路由 meta（title 使用 route key，i18nKey 使用 route.xxx）
    onRouteMetaGen(routeName) {
      // 将 routeName 强转为 RouteKey
      const key = routeName as RouteKey;

      // 常量路由列表（无需登录）
      const constantRoutes: RouteKey[] = ['login', '403', '404', '500'];

      // 生成基础 meta
      const meta: Partial<RouteMeta> = {
        // 默认标题
        title: key,
        // 默认 i18n key
        i18nKey: `route.${key}` as App.I18n.I18nKey
      };

      // 常量路由标记为 constant
      if (constantRoutes.includes(key)) {
        // 标记无需登录
        meta.constant = true;
        // if 分支结束
      }

      // 返回 meta
      return meta;
      // onRouteMetaGen 回调结束
    }
  });
}
