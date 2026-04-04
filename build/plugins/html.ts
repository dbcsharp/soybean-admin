// HTML 插件：构建阶段向 index.html 注入 buildTime meta（用于版本更新检测）
import type { Plugin } from 'vite';

// 创建 HTML 注入插件（中文说明：仅在 build 时生效，替换 <head> 注入 meta）
export function setupHtmlPlugin(buildTime: string) {
  // Vite 插件对象
  const plugin: Plugin = {
    // 插件名称
    name: 'html-plugin',
    // 仅构建阶段应用
    apply: 'build',
    // 转换 index.html 内容
    transformIndexHtml(html) {
      // 注入 buildTime meta，供运行时检测版本变化
      return html.replace('<head>', `<head>\n    <meta name="buildTime" content="${buildTime}">`);
      // transformIndexHtml 回调结束
    }
    // plugin 对象结束
  };

  // 返回插件对象
  return plugin;
  // setupHtmlPlugin 函数结束
}
