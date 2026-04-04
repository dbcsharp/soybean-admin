import type { AdminLayoutProps, LayoutCssVars, LayoutCssVarsProps } from '../../types';

// 布局滚动容器 id（可通过该 id 获取滚动元素并控制滚动）
export const LAYOUT_SCROLL_EL_ID = '__SCROLL_EL_ID__';

// 布局最大 z-index（Header/Tab/Sider/Footer 的 z-index 不超过该值）
export const LAYOUT_MAX_Z_INDEX = 100;

/**
 * 根据 cssVarsProps 生成 Layout CSS 变量
 *
 * @param props CSS 变量 props
 */
function createLayoutCssVarsByCssVarsProps(props: LayoutCssVarsProps) {
  // 生成 CSS 变量对象
  const cssVars: LayoutCssVars = {
    '--soy-header-height': `${props.headerHeight}px`,
    '--soy-header-z-index': props.headerZIndex,
    '--soy-tab-height': `${props.tabHeight}px`,
    '--soy-tab-z-index': props.tabZIndex,
    '--soy-sider-width': `${props.siderWidth}px`,
    '--soy-sider-collapsed-width': `${props.siderCollapsedWidth}px`,
    '--soy-sider-z-index': props.siderZIndex,
    '--soy-mobile-sider-z-index': props.mobileSiderZIndex,
    '--soy-footer-height': `${props.footerHeight}px`,
    '--soy-footer-z-index': props.footerZIndex
  };

  return cssVars;
}

/**
 * 创建布局 CSS 变量（按布局模式/移动端计算各区域 z-index）
 *
 * @param props
 */
export function createLayoutCssVars(props: AdminLayoutProps) {
  // 解构布局 props，并为 maxZIndex 提供默认值
  const {
    mode,
    isMobile,
    maxZIndex = LAYOUT_MAX_Z_INDEX,
    headerHeight,
    tabHeight,
    siderWidth,
    siderCollapsedWidth,
    footerHeight
  } = props;

  // 各区域 z-index：基于 maxZIndex 向下偏移，避免层级冲突
  const headerZIndex = maxZIndex - 3;
  const tabZIndex = maxZIndex - 5;
  const siderZIndex = mode === 'vertical' || isMobile ? maxZIndex - 1 : maxZIndex - 4;
  const mobileSiderZIndex = isMobile ? maxZIndex - 2 : 0;
  const footerZIndex = maxZIndex - 5;

  // CSS 变量 props
  const cssProps: LayoutCssVarsProps = {
    headerHeight,
    headerZIndex,
    tabHeight,
    tabZIndex,
    siderWidth,
    siderZIndex,
    mobileSiderZIndex,
    siderCollapsedWidth,
    footerHeight,
    footerZIndex
  };

  // 返回 CSS 变量对象
  return createLayoutCssVarsByCssVarsProps(cssProps);
}
