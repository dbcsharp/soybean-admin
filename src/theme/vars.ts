// 生成色板 CSS 变量映射（中文说明：把 primary/info/success/warning/error 的多个梯度拼成变量表）
function createColorPaletteVars() {
  // 主题色 key 列表
  const colors: App.Theme.ThemeColorKey[] = ['primary', 'info', 'success', 'warning', 'error'];
  // 色板梯度数值（与 tailwind/设计系统梯度一致）
  const colorPaletteNumbers: App.Theme.ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

  // 色板变量映射对象（key 为颜色名或颜色名-梯度）
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  // 遍历颜色 key，生成对应的 css var
  colors.forEach(color => {
    // 基础色：--primary-color 等
    colorPaletteVar[color] = `rgb(var(--${color}-color))`;
    // 梯度色：--primary-50-color 等
    colorPaletteNumbers.forEach(number => {
      colorPaletteVar[`${color}-${number}`] = `rgb(var(--${color}-${number}-color))`;
    });
  });

  // 返回色板变量映射
  return colorPaletteVar;
}

// 预先生成色板变量（中文说明：后续 themeVars 直接展开使用）
const colorPaletteVars = createColorPaletteVars();

// 主题 Token 的 CSS 变量表（中文说明：统一提供 colors 与 boxShadow 的 CSS var 映射）
export const themeVars: App.Theme.ThemeTokenCSSVars = {
  // 颜色相关 CSS 变量
  colors: {
    // 展开色板变量
    ...colorPaletteVars,
    // nprogress 进度条颜色
    nprogress: 'rgb(var(--nprogress-color))',
    // 容器背景色
    container: 'rgb(var(--container-bg-color))',
    // 布局背景色
    layout: 'rgb(var(--layout-bg-color))',
    // 反色背景色（用于深色菜单等）
    inverted: 'rgb(var(--inverted-bg-color))',
    // 基础文字颜色
    'base-text': 'rgb(var(--base-text-color))'
  },
  // 阴影相关 CSS 变量
  boxShadow: {
    // 头部阴影
    header: 'var(--header-box-shadow)',
    // 侧边栏阴影
    sider: 'var(--sider-box-shadow)',
    // 标签栏阴影
    tab: 'var(--tab-box-shadow)'
  }
};
