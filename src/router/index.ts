// 路由入口：根据环境变量创建 RouterHistory，注册内置路由并安装路由守卫
import type { App } from 'vue';
import {
  type RouterHistory,
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory
} from 'vue-router';
import { createBuiltinVueRoutes } from './routes/builtin';
import { createRouterGuard } from './guard';

// 读取路由模式与基础路径配置（VITE_ROUTER_HISTORY_MODE/VITE_BASE_URL）
const { VITE_ROUTER_HISTORY_MODE = 'history', VITE_BASE_URL } = import.meta.env;

// history 工厂映射：按模式选择 hash/history/memory 的 history 创建函数
const historyCreatorMap: Record<Env.RouterHistoryMode, (base?: string) => RouterHistory> = {
  // hash 模式：使用 URL hash
  hash: createWebHashHistory,
  // history 模式：使用 HTML5 history
  history: createWebHistory,
  // memory 模式：使用内存 history（常用于 SSR/测试）
  memory: createMemoryHistory
  // historyCreatorMap 对象定义结束
};

// 创建全局 router 实例（中文说明：history 由环境变量决定，routes 使用内置路由）
export const router = createRouter({
  // 创建 history 实例并传入 baseURL
  history: historyCreatorMap[VITE_ROUTER_HISTORY_MODE](VITE_BASE_URL),
  // 注册内置路由（root/not-found 等）
  routes: createBuiltinVueRoutes()
  // createRouter 配置对象结束
});

/** Setup Vue Router */
// 安装 Vue Router（中文说明：注册 router、挂载守卫，并等待 router 就绪）
export async function setupRouter(app: App) {
  // 将 router 安装到 Vue 应用
  app.use(router);
  // 注册路由守卫
  createRouterGuard(router);
  // 等待路由准备完成后再继续（确保异步路由/守卫初始化完成）
  await router.isReady();
  // setupRouter 函数结束
}
