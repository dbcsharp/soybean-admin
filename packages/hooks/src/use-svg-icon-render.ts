import { h } from 'vue';
import type { Component } from 'vue';

/**
 * SvgIcon 渲染 Hook（中文说明：生成可用于 NaiveUI 等场景的图标渲染函数）
 *
 * @param SvgIcon SvgIcon 组件
 */
export default function useSvgIconRender(SvgIcon: Component) {
  // 图标配置（iconify/localIcon 二选一）
  interface IconConfig {
    /** Iconify icon name */
    icon?: string;
    /** Local icon name */
    localIcon?: string;
    /** Icon color */
    color?: string;
    /** Icon size */
    fontSize?: number;
  }

  // style 类型：仅支持 color/fontSize
  type IconStyle = Partial<Pick<CSSStyleDeclaration, 'color' | 'fontSize'>>;

  /**
   * 生成 SvgIcon 的 VNode 渲染函数
   *
   * @param config
   */
  const SvgIconVNode = (config: IconConfig) => {
    const { color, fontSize, icon, localIcon } = config;

    // 动态 style
    const style: IconStyle = {};

    // 设置颜色
    if (color) {
      style.color = color;
    }
    // 设置字号（px）
    if (fontSize) {
      style.fontSize = `${fontSize}px`;
    }

    // icon/localIcon 都不存在时返回 undefined，便于调用方做条件渲染
    if (!icon && !localIcon) {
      return undefined;
    }

    // 返回 render 函数：外部组件可直接使用该函数渲染
    return () => h(SvgIcon, { icon, localIcon, style });
  };

  // 对外暴露 SvgIconVNode
  return {
    SvgIconVNode
  };
}
