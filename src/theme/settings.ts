// 默认主题配置（用于初始化主题 store，并作为预设合并的基准）
export const themeSettings: App.Theme.ThemeSetting = {
  // 主题模式：light/dark/auto
  themeScheme: 'light',
  // 灰色模式
  grayscale: false,
  // 色弱模式
  colourWeakness: false,
  // 是否启用推荐算法生成主题色梯度
  recommendColor: false,
  // 主色（primary）
  themeColor: '#646cff',
  // 全局圆角半径
  themeRadius: 6,
  // 其它语义色（info/success/warning/error）
  otherColor: {
    // 信息色
    info: '#2080f0',
    // 成功色
    success: '#52c41a',
    // 警告色
    warning: '#faad14',
    // 错误色
    error: '#f5222d'
  },
  // info 色是否跟随 primary
  isInfoFollowPrimary: true,
  // 布局配置：模式与滚动模式
  layout: {
    // 布局模式：vertical/vertical-mix/vertical-hybrid-header-first/horizontal/top-hybrid-*
    mode: 'vertical',
    // 滚动模式：content/wrapper
    scrollMode: 'content'
  },
  // 页面配置：切换动画
  page: {
    // 是否启用页面切换动画
    animate: true,
    // 动画模式
    animateMode: 'fade-slide'
  },
  // 头部配置
  header: {
    // 头部高度
    height: 56,
    // 面包屑配置
    breadcrumb: {
      // 是否显示面包屑
      visible: true,
      // 是否显示面包屑图标
      showIcon: true
    },
    // 多语言切换开关
    multilingual: {
      // 是否显示多语言切换
      visible: true
    },
    // 全局搜索开关
    globalSearch: {
      // 是否显示全局搜索
      visible: true
    }
  },
  // 标签栏配置
  tab: {
    // 是否显示标签栏
    visible: true,
    // 是否缓存标签页（KeepAlive）
    cache: true,
    // 标签栏高度
    height: 44,
    // 标签样式模式
    mode: 'chrome',
    // 是否允许中键关闭标签页
    closeTabByMiddleClick: false
  },
  // 是否固定头部与标签栏（仅 wrapper 滚动模式有效）
  fixedHeaderAndTab: true,
  // 侧边栏配置
  sider: {
    // 是否反色（亮色模式下的深色侧边栏）
    inverted: false,
    // 侧边栏宽度（vertical）
    width: 220,
    // 侧边栏折叠宽度
    collapsedWidth: 64,
    // mix 模式一级菜单宽度
    mixWidth: 90,
    // mix 模式一级菜单折叠宽度
    mixCollapsedWidth: 64,
    // mix 模式子菜单宽度
    mixChildMenuWidth: 200,
    // hybrid 模式是否自动选中第一个菜单
    autoSelectFirstMenu: false
  },
  // 底部配置
  footer: {
    // 是否显示底部
    visible: true,
    // 是否固定底部（仅 wrapper 滚动模式有效）
    fixed: false,
    // 底部高度
    height: 48,
    // 是否右对齐（顶部混合布局下）
    right: true
  },
  // 水印配置
  watermark: {
    // 是否显示水印
    visible: false,
    // 自定义水印文本
    text: 'SoybeanAdmin',
    // 是否包含用户名
    enableUserName: false,
    // 是否包含时间
    enableTime: false,
    // 时间格式
    timeFormat: 'YYYY-MM-DD HH:mm'
  },
  // Token 配置：不同主题下的颜色/阴影等 CSS 变量值
  tokens: {
    // 亮色主题 token
    light: {
      // 颜色 token
      colors: {
        // 容器背景色
        container: 'rgb(255, 255, 255)',
        // 布局背景色
        layout: 'rgb(247, 250, 252)',
        // 反色背景色
        inverted: 'rgb(0, 20, 40)',
        // 基础文字颜色
        'base-text': 'rgb(31, 31, 31)'
      },
      // 阴影 token
      boxShadow: {
        // 头部阴影
        header: '0 1px 2px rgb(0, 21, 41, 0.08)',
        // 侧边栏阴影
        sider: '2px 0 8px 0 rgb(29, 35, 41, 0.05)',
        // 标签栏阴影
        tab: '0 1px 2px rgb(0, 21, 41, 0.08)'
      }
    },
    // 暗色主题 token
    dark: {
      // 颜色 token
      colors: {
        // 容器背景色
        container: 'rgb(28, 28, 28)',
        // 布局背景色
        layout: 'rgb(18, 18, 18)',
        // 基础文字颜色
        'base-text': 'rgb(224, 224, 224)'
      }
    }
  }
};

/**
 * Override theme settings
 *
 * If publish new version, use `overrideThemeSettings` to override certain theme settings
 */
// 主题配置覆盖（发布新版本时可在此覆写部分默认配置）
export const overrideThemeSettings: Partial<App.Theme.ThemeSetting> = {};
