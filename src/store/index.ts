import type { App } from 'vue';
import { createPinia } from 'pinia';
import { resetSetupStore } from './plugins';

/** Setup Vue store plugin pinia */
// 初始化 Pinia 并注入到 Vue 应用（中文说明：同时挂载 setup 语法 store 的 $reset 支持插件）
export function setupStore(app: App) {
  // 创建 Pinia 实例
  const store = createPinia();

  // 注册 Pinia 插件：为 setup 写法的 store 注入可重置能力
  store.use(resetSetupStore);

  // 将 Pinia 安装到 Vue 应用实例
  app.use(store);
  // setupStore 函数结束
}
