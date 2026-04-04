import { addColorAlpha, transformColorWithOpacity } from '@sa/color';
import type { PageTabCssVars, PageTabCssVarsProps } from '../../types';

// 标签页激活色（默认蓝色）
export const ACTIVE_COLOR = '#1890ff';

// 创建标签页 CSS 变量（内部方法）
function createCssVars(props: PageTabCssVarsProps) {
  const cssVars: PageTabCssVars = {
    '--soy-primary-color': props.primaryColor,
    '--soy-primary-color1': props.primaryColor1,
    '--soy-primary-color2': props.primaryColor2,
    '--soy-primary-color-opacity1': props.primaryColorOpacity1,
    '--soy-primary-color-opacity2': props.primaryColorOpacity2,
    '--soy-primary-color-opacity3': props.primaryColorOpacity3
  };

  return cssVars;
}

// 创建标签页 CSS 变量（根据主色生成不同透明度/不同背景下的混合色）
export function createTabCssVars(primaryColor: string) {
  const cssProps: PageTabCssVarsProps = {
    primaryColor,
    primaryColor1: transformColorWithOpacity(primaryColor, 0.1, '#ffffff'),
    primaryColor2: transformColorWithOpacity(primaryColor, 0.3, '#000000'),
    primaryColorOpacity1: addColorAlpha(primaryColor, 0.1),
    primaryColorOpacity2: addColorAlpha(primaryColor, 0.15),
    primaryColorOpacity3: addColorAlpha(primaryColor, 0.3)
  };

  return createCssVars(cssProps);
}
