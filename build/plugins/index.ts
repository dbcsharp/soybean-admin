// Vite 插件集合：按环境组装 Vue/VueJSX/路由生成/UnoCSS/unplugin/HTML 注入/Devtools 等插件
import type { PluginOption } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import progress from 'vite-plugin-progress';
import vueRootValidator from 'vite-plugin-vue-transition-root-validator';
import { setupElegantRouter } from './router';
import { setupUnocss } from './unocss';
import { setupUnplugin } from './unplugin';
import { setupHtmlPlugin } from './html';
import { setupDevtoolsPlugin } from './devtools';

// 组装 Vite 插件（中文说明：按顺序注册核心插件与构建期插件，并传入环境变量与 buildTime）
export function setupVitePlugins(viteEnv: Env.ImportMeta, buildTime: string) {
  // 插件数组（PluginOption 可为 Plugin 或 Plugin[]）
  const plugins: PluginOption = [
    // Vue SFC 支持
    vue(),
    // Vue JSX 支持
    vueJsx(),
    // Vue Devtools 插件（按环境决定 editor）
    setupDevtoolsPlugin(viteEnv),
    // elegant-router 生成路由插件
    setupElegantRouter(),
    // UnoCSS 插件（用于图标/样式）
    setupUnocss(viteEnv),
    // unplugin-icons/unplugin-vue-components/svg-icons 等插件集合
    ...setupUnplugin(viteEnv),
    // 构建/启动进度条
    progress(),
    // 构建期向 index.html 注入 buildTime meta
    setupHtmlPlugin(buildTime),
    // 路由过渡根节点校验插件
    vueRootValidator()
    // plugins 数组结束
  ];

  // 返回插件数组
  return plugins;
  // setupVitePlugins 函数结束
}
