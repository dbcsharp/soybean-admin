// Unplugin 插件集合：配置 unplugin-icons、unplugin-vue-components 以及 svg-icons 自动注册
import process from 'node:process';
import path from 'node:path';
import fs from 'node:fs';
import type { PluginOption } from 'vite';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import Icons from 'unplugin-icons/vite';
import IconsResolver from 'unplugin-icons/resolver';
import Components from 'unplugin-vue-components/vite';
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers';
import { ProNaiveUIResolver } from 'pro-naive-ui-resolver';
import { FileSystemIconLoader } from 'unplugin-icons/loaders';

// 创建 unplugin 系列插件（自动按需引入组件/图标，并注册本地 svg symbol）
export function setupUnplugin(viteEnv: Env.ImportMeta) {
  // 从环境变量读取 Icon 前缀与本地集合前缀
  const { VITE_ICON_PREFIX, VITE_ICON_LOCAL_PREFIX } = viteEnv;

  // 本地图标目录路径（src/assets/svg-icon）
  const localIconPath = path.join(process.cwd(), 'src/assets/svg-icon');

  // 自动生成组件类型声明（中文说明：unplugin-vue-components 的 TSX 支持段落会生成非法声明，这里通过中间文件裁剪后再写回）
  const componentsDtsPath = path.join(process.cwd(), 'src/typings/components.d.ts');
  const generatedComponentsDtsPath = path.join(process.cwd(), 'src/typings/components.generated.d.ts');

  /** The name of the local icon collection */
  // 本地图标集合名称（从 local 前缀中移除 icon 前缀部分）
  const collectionName = VITE_ICON_LOCAL_PREFIX.replace(`${VITE_ICON_PREFIX}-`, '');

  // 同步生成的 dts 到最终 dts（中文说明：移除 “For TSX support” 段落以保证 TypeScript 可解析）
  async function syncComponentsDts() {
    if (!fs.existsSync(generatedComponentsDtsPath)) return;

    const content = await fs.promises.readFile(generatedComponentsDtsPath, 'utf8');
    const marker = '// For TSX support';
    const idx = content.indexOf(marker);
    const next = idx >= 0 ? `${content.slice(0, idx).trimEnd()}\n` : content;

    await fs.promises.mkdir(path.dirname(componentsDtsPath), { recursive: true });
    await fs.promises.writeFile(componentsDtsPath, next);
  }

  // 插件数组
  const plugins: PluginOption[] = [
    // unplugin-icons：将 icon 按组件形式引入（支持自定义本地图标集合）
    Icons({
      // Vue3 编译器
      compiler: 'vue3',
      // 自定义图标集合（本地 svg-icon）
      customCollections: {
        // 本地集合：从文件系统加载 svg，并统一补齐 width/height 为 1em
        [collectionName]: FileSystemIconLoader(localIconPath, svg =>
          svg.replace(/^<svg\s/, '<svg width="1em" height="1em" ')
        )
      },
      // 图标缩放比例
      scale: 1,
      // 默认 class（用于 inline-block 显示）
      defaultClass: 'inline-block'
    }),
    // unplugin-vue-components：自动按需引入组件（NaiveUI/ProNaiveUI/Icons）
    Components({
      // 生成 dts 文件路径（用于 TS 类型提示）
      dts: 'src/typings/components.generated.d.ts',
      // 额外类型声明（RouterLink/RouterView）
      types: [{ from: 'vue-router', names: ['RouterLink', 'RouterView'] }],
      // 组件解析器集合
      resolvers: [
        // NaiveUI 组件解析器
        NaiveUiResolver(),
        // Pro Naive UI 组件解析器
        ProNaiveUIResolver(),
        // Icons 解析器（自定义集合 + 组件前缀）
        IconsResolver({ customCollections: [collectionName], componentPrefix: VITE_ICON_PREFIX })
      ]
    }),
    // 开发/构建时自动裁剪并回写 components.d.ts
    {
      name: 'sync-components-dts',
      async buildEnd() {
        await syncComponentsDts();
      },
      configureServer(server) {
        const watcher = server.watcher;
        watcher.add(generatedComponentsDtsPath);

        const onChange = async (file: string) => {
          if (path.resolve(file) === path.resolve(generatedComponentsDtsPath)) {
            await syncComponentsDts();
          }
        };

        watcher.on('add', onChange);
        watcher.on('change', onChange);

        syncComponentsDts();
      }
    },
    // vite-plugin-svg-icons：将本地 svg 注册为 symbol（用于 <svg><use> 引用）
    createSvgIconsPlugin({
      // svg 图标目录
      iconDirs: [localIconPath],
      // symbolId 格式
      symbolId: `${VITE_ICON_LOCAL_PREFIX}-[dir]-[name]`,
      // 注入位置
      inject: 'body-last',
      // 自定义 DOM 容器 id
      customDomId: '__SVG_ICON_LOCAL__'
    })
  ];

  // 返回插件数组
  return plugins;
}
