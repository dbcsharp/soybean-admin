// 路由配置：定义自定义路由（customRoutes）、合并生成路由（generatedRoutes），并按 constant 标记拆分常量/权限路由
import type { CustomRoute, ElegantConstRoute, ElegantRoute } from '@elegant-router/types';
import { generatedRoutes } from '../elegant/routes';
import { layouts, views } from '../elegant/imports';
import { transformElegantRoutesToVueRoutes } from '../elegant/transform';

/**
 * custom routes
 *
 * @link https://github.com/soybeanjs/elegant-router?tab=readme-ov-file#custom-route
 */
// 自定义路由数组（中文说明：用于补充/覆盖生成路由配置）
const customRoutes: CustomRoute[] = [
  // 异常页面路由组
  {
    // 路由 name
    name: 'exception',
    // 路由 path
    path: '/exception',
    // 使用基础布局
    component: 'layout.base',
    // 路由 meta（标题/i18n/图标/排序等）
    meta: {
      // 标题
      title: 'exception',
      // i18n key
      i18nKey: 'route.exception',
      // 菜单图标
      icon: 'ant-design:exception-outlined',
      // 菜单排序
      order: 7
      // meta 对象结束
    },
    // 子路由：403/404/500
    children: [
      // 403 页面
      {
        // 路由 name
        name: 'exception_403',
        // 路由 path
        path: '/exception/403',
        // 路由组件
        component: 'view.403',
        // 路由 meta
        meta: {
          // 标题
          title: 'exception_403',
          // i18n key
          i18nKey: 'route.exception_403',
          // 图标
          icon: 'ic:baseline-block'
          // meta 对象结束
        }
        // 子路由对象结束
      },
      // 404 页面
      {
        name: 'exception_404',
        path: '/exception/404',
        component: 'view.404',
        meta: {
          title: 'exception_404',
          i18nKey: 'route.exception_404',
          icon: 'ic:baseline-web-asset-off'
        }
      },
      // 500 页面
      {
        name: 'exception_500',
        path: '/exception/500',
        component: 'view.500',
        meta: {
          title: 'exception_500',
          i18nKey: 'route.exception_500',
          icon: 'ic:baseline-wifi-off'
        }
      }
      // children 数组结束
    ]
  },
  // 文档路由组（iframe 内嵌外部文档）
  {
    name: 'document',
    path: '/document',
    component: 'layout.base',
    meta: {
      title: 'document',
      i18nKey: 'route.document',
      order: 2,
      icon: 'mdi:file-document-multiple-outline'
    },
    children: [
      // Ant Design Vue 文档（iframe）
      {
        name: 'document_antd',
        path: '/document/antd',
        component: 'view.iframe-page',
        props: {
          url: 'https://antdv.com/components/overview-cn'
        },
        meta: {
          title: 'document_antd',
          i18nKey: 'route.document_antd',
          order: 7,
          icon: 'logos:ant-design'
        }
      },
      // NaiveUI 文档（iframe）
      {
        name: 'document_naive',
        path: '/document/naive',
        component: 'view.iframe-page',
        props: {
          url: 'https://www.naiveui.com/zh-CN/os-theme/docs/introduction'
        },
        meta: {
          title: 'document_naive',
          i18nKey: 'route.document_naive',
          order: 6,
          icon: 'logos:naiveui'
        }
      },
      // Pro Naive UI 文档（iframe）
      {
        name: 'document_pro-naive',
        path: '/document/pro-naive',
        component: 'view.iframe-page',
        props: {
          url: 'https://naive-ui.pro-components.cn/'
        },
        meta: {
          title: 'document_pro-naive',
          i18nKey: 'route.document_pro-naive',
          order: 6,
          icon: 'logos:naiveui'
        }
      },
      // Alova 文档（iframe）
      {
        name: 'document_alova',
        path: '/document/alova',
        component: 'view.iframe-page',
        props: {
          url: 'https://alova.js.org'
        },
        meta: {
          title: 'document_alova',
          i18nKey: 'route.document_alova',
          order: 7,
          localIcon: 'alova'
        }
      },
      // 项目文档（iframe）
      {
        name: 'document_project',
        path: '/document/project',
        component: 'view.iframe-page',
        props: {
          url: 'https://docs.soybeanjs.cn/zh'
        },
        meta: {
          title: 'document_project',
          i18nKey: 'route.document_project',
          order: 1,
          localIcon: 'logo'
        }
      },
      // 项目文档（href 外链打开）
      {
        name: 'document_project-link',
        path: '/document/project-link',
        component: 'view.iframe-page',
        meta: {
          title: 'document_project-link',
          i18nKey: 'route.document_project-link',
          order: 2,
          localIcon: 'logo',
          href: 'https://docs.soybeanjs.cn/zh'
        }
      },
      // 项目视频（href 外链打开）
      {
        name: 'document_video',
        path: '/document/video',
        component: 'view.iframe-page',
        meta: {
          title: 'document_video',
          i18nKey: 'route.document_video',
          order: 2,
          localIcon: 'logo',
          href: 'https://www.bilibili.com/video/BV1YKdRYXELC'
        }
      },
      // UnoCSS 文档（iframe）
      {
        name: 'document_unocss',
        path: '/document/unocss',
        component: 'view.iframe-page',
        props: {
          url: 'https://unocss.dev/'
        },
        meta: {
          title: 'document_unocss',
          i18nKey: 'route.document_unocss',
          order: 5,
          icon: 'logos:unocss'
        }
      },
      // Vite 文档（iframe）
      {
        name: 'document_vite',
        path: '/document/vite',
        component: 'view.iframe-page',
        props: {
          url: 'https://cn.vitejs.dev/'
        },
        meta: {
          title: 'document_vite',
          i18nKey: 'route.document_vite',
          order: 4,
          icon: 'logos:vitejs'
        }
      },
      // Vue 文档（iframe）
      {
        name: 'document_vue',
        path: '/document/vue',
        component: 'view.iframe-page',
        props: {
          url: 'https://cn.vuejs.org/'
        },
        meta: {
          title: 'document_vue',
          i18nKey: 'route.document_vue',
          order: 3,
          icon: 'logos:vue'
        }
      }
    ]
  }
];

/** create routes when the auth route mode is static */
// 创建静态模式路由集合（中文说明：按 meta.constant 拆分 constantRoutes 与 authRoutes）
export function createStaticRoutes() {
  // 常量路由容器
  const constantRoutes: ElegantRoute[] = [];

  // 权限路由容器
  const authRoutes: ElegantRoute[] = [];

  // 合并自定义路由与生成路由，并按 constant 拆分
  [...customRoutes, ...generatedRoutes].forEach(item => {
    // meta.constant 为 true 时归类为常量路由
    if (item.meta?.constant) {
      constantRoutes.push(item);
    } else {
      // 否则归类为权限路由
      authRoutes.push(item);
    }
  });

  // 返回拆分结果
  return {
    constantRoutes,
    authRoutes
  };
  // createStaticRoutes 函数结束
}

/**
 * Get auth vue routes
 *
 * @param routes Elegant routes
 */
// 将 ElegantConstRoute 转换为 vue-router 路由记录（中文说明：通过 transformElegantRoutesToVueRoutes 完成转换）
export function getAuthVueRoutes(routes: ElegantConstRoute[]) {
  // 调用转换方法并注入 layouts/views 映射
  return transformElegantRoutesToVueRoutes(routes, layouts, views);
  // getAuthVueRoutes 函数结束
}
