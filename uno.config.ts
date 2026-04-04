// UnoCSS 配置入口：定义主题变量、快捷类、transformers 与 presets（Wind3 + SoybeanAdmin）
import { defineConfig, transformerDirectives, transformerVariantGroup, presetWind3 } from 'unocss';
import { presetSoybeanAdmin } from '@sa/uno-preset';
import { themeVars } from './src/theme/vars';

// 导出 UnoCSS 配置（中文说明：扫描内容、合并主题变量并注册预设/转换器）
export default defineConfig({
  // 内容扫描配置（用于生成按需的原子类）
  content: {
    // pipeline 配置（排除不需要扫描的目录）
    pipeline: {
      // 排除 node_modules 与 dist
      exclude: ['node_modules', 'dist']
    }
  },
  // 主题配置
  theme: {
    // 注入项目主题 CSS 变量映射
    ...themeVars,
    // 定义图标字号（用于统一图标大小 class）
    fontSize: {
      // 超小图标
      'icon-xs': '0.875rem',
      // 小图标
      'icon-small': '1rem',
      // 默认图标
      icon: '1.125rem',
      // 大图标
      'icon-large': '1.5rem',
      // 超大图标
      'icon-xl': '2rem'
    }
  },
  // 快捷类（中文说明：自定义组合 class，减少重复写法）
  shortcuts: {
    // 卡片容器快捷类：圆角 + 阴影
    'card-wrapper': 'rd-8px shadow-sm'
  },
  // 转换器（支持 @apply 指令与变体组语法）
  transformers: [transformerDirectives(), transformerVariantGroup()],
  // 预设集合（Wind3 + SoybeanAdmin，dark 模式使用 class）
  presets: [presetWind3({ dark: 'class' }), presetSoybeanAdmin()]
});
