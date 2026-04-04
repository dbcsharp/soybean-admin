// Vite 配置入口：加载环境变量、组装插件、注入构建时间、并按需启用代理与构建选项
import process from 'node:process';
import { URL, fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import { setupVitePlugins } from './build/plugins';
import { createViteProxy, getBuildTime } from './build/config';

// 导出 Vite 配置（中文说明：通过 defineConfig 读取 mode/command 并返回配置对象）
export default defineConfig(configEnv => {
  // 加载当前模式的环境变量，并转换为 Env.ImportMeta 类型
  const viteEnv = loadEnv(configEnv.mode, process.cwd()) as unknown as Env.ImportMeta;

  // 生成构建时间字符串（用于注入 BUILD_TIME 与 html meta）
  const buildTime = getBuildTime();

  // 是否启用代理：仅在 serve 且非 preview 时启用
  const enableProxy = configEnv.command === 'serve' && !configEnv.isPreview;

  // 返回 Vite 配置对象
  return {
    // 基础路径（用于非根路径部署）
    base: viteEnv.VITE_BASE_URL,
    // 路径解析与别名配置
    resolve: {
      // 路径别名映射
      alias: {
        // 项目根目录别名
        '~': fileURLToPath(new URL('./', import.meta.url)),
        // src 目录别名
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    // CSS 预处理配置
    css: {
      // 预处理器选项
      preprocessorOptions: {
        // scss 选项
        scss: {
          // 使用 modern-compiler API
          api: 'modern-compiler',
          // 自动注入全局 scss（无需每个文件手动引入）
          additionalData: `@use "@/styles/scss/global.scss" as *;`
        }
      }
    },
    // 插件集合
    plugins: setupVitePlugins(viteEnv, buildTime),
    // 全局常量注入
    define: {
      // 注入构建时间常量（运行时用于版本判断等）
      BUILD_TIME: JSON.stringify(buildTime)
    },
    // 开发服务器配置
    server: {
      // 监听地址
      host: '0.0.0.0',
      // 端口
      port: 9527,
      // 启动时自动打开浏览器
      open: true,
      // 代理配置（按环境与 enableProxy 决定是否返回）
      proxy: createViteProxy(viteEnv, enableProxy)
    },
    // 预览服务器配置
    preview: {
      // 预览端口
      port: 9725
    },
    // 构建配置
    build: {
      // 不输出 gzip/brotli 体积报告（提升构建速度）
      reportCompressedSize: false,
      // 是否输出 sourcemap（由环境变量控制）
      sourcemap: viteEnv.VITE_SOURCE_MAP === 'Y',
      // commonjs 配置
      commonjsOptions: {
        // 不忽略 try/catch（保留对某些库的兼容）
        ignoreTryCatch: false
      }
    }
  };
  // defineConfig 回调结束
});
