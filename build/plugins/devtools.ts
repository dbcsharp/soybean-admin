// Devtools 插件：用于在开发环境启用 Vue Devtools，并配置打开编辑器的方式
import VueDevtools from 'vite-plugin-vue-devtools';

// 创建 Devtools 插件（注入 launchEditor 参数，支持点击组件定位到编辑器）
export function setupDevtoolsPlugin(viteEnv: Env.ImportMeta) {
  // 从环境变量读取 launchEditor 配置
  const { VITE_DEVTOOLS_LAUNCH_EDITOR } = viteEnv;

  // 返回 VueDevtools 插件实例
  return VueDevtools({
    // 点击组件时打开编辑器的命令/协议
    launchEditor: VITE_DEVTOOLS_LAUNCH_EDITOR
    // VueDevtools 配置对象结束
  });
}
