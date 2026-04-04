// UnoCSS Vite 插件：配置图标预设（Iconify + 本地图标）并注入到构建流程
import process from 'node:process';
import path from 'node:path';
import { presetIcons } from 'unocss';
import unocss from 'unocss/vite';
import { FileSystemIconLoader } from '@iconify/utils/lib/loader/node-loaders';

// 创建 UnoCSS 插件（中文说明：按环境变量配置 Icon 前缀，并从本地 svg-icon 目录加载图标集合）
export function setupUnocss(viteEnv: Env.ImportMeta) {
  // 从环境变量读取 Icon 前缀与本地集合前缀
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  // 本地图标目录路径（src/assets/svg-icon）
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  /** The name of the local icon collection */
  // 本地图标集合名称（中文说明：从 local 前缀中移除 icon 前缀部分）
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  // 返回 UnoCSS 插件实例
  return unocss({
    // 预设集合
    presets: [
      // Icon 预设：支持 Iconify 图标与本地图标集合
      presetIcons({
        // 组件前缀（例如 i-）
        prefix: `${VITE_ICON_PREFIX}-`,
        // 图标缩放比例
        scale: 1,
        // 图标额外样式
        extraProperties: {
          // 使图标内联显示
          display: 'inline-block'
        },
        // 图标集合配置
        collections: {
          // 本地集合：从文件系统加载 svg，并统一补齐 width/height 为 1em
          [collectionName]: FileSystemIconLoader(localIconPath, svg =>
            svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
          )
        },
        // 输出警告（找不到图标时提示）
        warn: true
      })
    ]
  });
  // setupUnocss 函数结束
}
