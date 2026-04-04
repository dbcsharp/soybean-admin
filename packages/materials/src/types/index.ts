/** 头部配置 */
interface AdminLayoutHeaderConfig {
  /**
   * 是否显示头部
   *
   * @default true
   */
  headerVisible?: boolean;
  /**
   * 头部高度
   *
   * @default 56px
   */
  headerHeight?: number;
}

/** 标签页配置 */
interface AdminLayoutTabConfig {
  /**
   * 是否显示标签页
   *
   * @default true
   */
  tabVisible?: boolean;
  /**
   * 标签页 class
   *
   * @default ''
   */
  tabClass?: string;
  /**
   * 标签页高度
   *
   * @default 48px
   */
  tabHeight?: number;
}

/** 侧边栏配置 */
interface AdminLayoutSiderConfig {
  /**
   * 是否显示侧边栏
   *
   * @default true
   */
  siderVisible?: boolean;
  /**
   * 侧边栏 class
   *
   * @default ''
   */
  siderClass?: string;
  /**
   * 移动端侧边栏 class
   *
   * @default ''
   */
  mobileSiderClass?: string;
  /**
   * 侧边栏是否折叠
   *
   * @default false
   */
  siderCollapse?: boolean;
  /**
   * 侧边栏宽度（未折叠）
   *
   * @default '220px'
   */
  siderWidth?: number;
  /**
   * 侧边栏宽度（折叠）
   *
   * @default '64px'
   */
  siderCollapsedWidth?: number;
}

/** 内容区配置 */
export interface AdminLayoutContentConfig {
  /**
   * 内容区 class
   *
   * @default ''
   */
  contentClass?: string;
  /**
   * 内容区是否全屏
   *
   * 为 true 时，其他区域会通过 `display: none` 隐藏
   */
  fullContent?: boolean;
}

/** 底部配置 */
export interface AdminLayoutFooterConfig {
  /**
   * 是否显示底部
   *
   * @default true
   */
  footerVisible?: boolean;
  /**
   * 底部是否固定
   *
   * @default true
   */
  fixedFooter?: boolean;
  /**
   * 底部 class
   *
   * @default ''
   */
  footerClass?: string;
  /**
   * 底部高度
   *
   * @default 48px
   */
  footerHeight?: number;
  /**
   * 底部是否在右侧
   *
   * 当布局为 vertical 时，底部位于右侧
   */
  rightFooter?: boolean;
}

/**
 * 布局模式
 *
 * - horizontal：顶部布局
 * - vertical：侧边布局
 */
export type LayoutMode = 'horizontal' | 'vertical';

/**
 * 内容溢出时的滚动模式
 *
 * - wrapper：布局外层容器滚动
 * - content：内容区域滚动
 *
 * @default wrapper
 */
export type LayoutScrollMode = 'wrapper' | 'content';

/** AdminLayout 组件 props */
export interface AdminLayoutProps
  extends
    AdminLayoutHeaderConfig,
    AdminLayoutTabConfig,
    AdminLayoutSiderConfig,
    AdminLayoutContentConfig,
    AdminLayoutFooterConfig {
  /**
   * 布局模式
   *
   * - {@link LayoutMode}
   */
  mode?: LayoutMode;
  /** 是否移动端布局 */
  isMobile?: boolean;
  /**
   * 滚动模式
   *
   * - {@link LayoutScrollMode}
   */
  scrollMode?: LayoutScrollMode;
  /**
   * 布局滚动元素的 id
   *
   * 可用于获取对应 DOM 并控制滚动
   *
   * @example
   *   通过导入使用默认 id
   *   ```ts
   *   import { adminLayoutScrollElId } from '@sa/vue-materials';
   *   ```
   *
   * @default
   * ```ts
   * const adminLayoutScrollElId = '__ADMIN_LAYOUT_SCROLL_EL_ID__'
   * ```
   */
  scrollElId?: string;
  /** 滚动元素的 class */
  scrollElClass?: string;
  /** 滚动容器 wrapper 的 class */
  scrollWrapperClass?: string;
  /**
   * 布局通用 class
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /**
   * 是否固定头部与标签页
   *
   * @default true
   */
  fixedTop?: boolean;
  /**
   * 布局最大 z-index
   *
   * Header/Tab/Sider/Footer 的 z-index 不会超过该值
   */
  maxZIndex?: number;
}

type Kebab<S extends string> = S extends Uncapitalize<S> ? S : `-${Uncapitalize<S>}`;

type KebabCase<S extends string> = S extends `${infer Start}${infer End}`
  ? `${Uncapitalize<Start>}${KebabCase<Kebab<End>>}`
  : S;

type Prefix = '--soy-';

export type LayoutCssVarsProps = Pick<
  AdminLayoutProps,
  'headerHeight' | 'tabHeight' | 'siderWidth' | 'siderCollapsedWidth' | 'footerHeight'
> & {
  headerZIndex?: number;
  tabZIndex?: number;
  siderZIndex?: number;
  mobileSiderZIndex?: number;
  footerZIndex?: number;
};

export type LayoutCssVars = {
  [K in keyof LayoutCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};

/**
 * 标签页模式
 *
 * - button：按钮风格
 * - chrome：Chrome 风格
 * - slider：滑块风格
 *
 * @default chrome
 */
export type PageTabMode = 'button' | 'chrome' | 'slider';

export interface PageTabProps {
  /** 是否暗黑模式 */
  darkMode?: boolean;
  /**
   * 标签页模式
   *
   * - {@link PageTabMode}
   */
  mode?: PageTabMode;
  /**
   * 通用 class
   *
   * 可用于配置过渡动画
   *
   * @default 'transition-all-300'
   */
  commonClass?: string;
  /** button 模式的 class */
  buttonClass?: string;
  /** chrome 模式的 class */
  chromeClass?: string;
  /** slider 模式的 class */
  sliderClass?: string;
  /** 是否激活 */
  active?: boolean;
  /** 激活颜色 */
  activeColor?: string;
  /**
   * 是否可关闭
   *
   * 为 true 时显示关闭图标
   */
  closable?: boolean;
}

export type PageTabCssVarsProps = {
  primaryColor: string;
  primaryColor1: string;
  primaryColor2: string;
  primaryColorOpacity1: string;
  primaryColorOpacity2: string;
  primaryColorOpacity3: string;
};

export type PageTabCssVars = {
  [K in keyof PageTabCssVarsProps as `${Prefix}${KebabCase<K>}`]: string | number;
};
