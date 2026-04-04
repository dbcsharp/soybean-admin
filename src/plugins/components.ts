import type { App } from 'vue';
import { ProDate, ProDateTime, ProInput, ProRate, create } from 'pro-naive-ui';

/** pro-naive-ui 支持配置表单的按需加载，所以需要注册 */
// 注册 Pro Naive UI 组件（中文说明：通过 create 注册按需组件后安装到 app）
export function setupProNaiveComponents(app: App) {
  // 创建 Pro Naive 实例，并注册需要的组件
  const proNaive = create({
    // 按需组件列表
    components: [ProInput, ProDate, ProDateTime, ProRate]
    // create 配置对象结束
  });
  // 将 Pro Naive 安装到 Vue 应用
  app.use(proNaive);
  // setupProNaiveComponents 函数结束
}
