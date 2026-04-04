import { colord, extend } from 'colord';
import namesPlugin from 'colord/plugins/names';
import mixPlugin from 'colord/plugins/mix';
import labPlugin from 'colord/plugins/lab';
import type { AnyColor, HslColor, RgbColor } from 'colord';

// 注册 colord 插件（names/mix/lab）
extend([namesPlugin, mixPlugin, labPlugin]);

// 判断颜色是否合法
export function isValidColor(color: AnyColor) {
  return colord(color).isValid();
}

// 转为 hex
export function getHex(color: AnyColor) {
  return colord(color).toHex();
}

// 转为 rgb
export function getRgb(color: AnyColor) {
  return colord(color).toRgb();
}

// 转为 hsl
export function getHsl(color: AnyColor) {
  return colord(color).toHsl();
}

// 转为 hsv
export function getHsv(color: AnyColor) {
  return colord(color).toHsv();
}

// 计算两色差异（DeltaE）
export function getDeltaE(color1: AnyColor, color2: AnyColor) {
  return colord(color1).delta(color2);
}

// HSL 转 hex
export function transformHslToHex(color: HslColor) {
  return colord(color).toHex();
}

/**
 * 添加透明度并输出 hex
 *
 * @param color 颜色
 * @param alpha 透明度（0~1）
 */
export function addColorAlpha(color: AnyColor, alpha: number) {
  return colord(color).alpha(alpha).toHex();
}

/**
 * 混合两种颜色并输出 hex
 *
 * @param firstColor 颜色 1
 * @param secondColor 颜色 2
 * @param ratio 颜色 2 的占比（0~1）
 */
export function mixColor(firstColor: AnyColor, secondColor: AnyColor, ratio: number) {
  return colord(firstColor).mix(secondColor, ratio).toHex();
}

/**
 * 将带透明度的颜色转换为近似的不透明颜色（按背景色反推混合结果）
 *
 * @param color 颜色
 * @param alpha 透明度（0~1）
 * @param bgColor 背景色（通常为白/黑）
 */
export function transformColorWithOpacity(color: AnyColor, alpha: number, bgColor = '#ffffff') {
  // 先把颜色加上 alpha 得到带透明度的 hex
  const originColor = addColorAlpha(color, alpha);
  // 取带透明度颜色的 rgb
  const { r: oR, g: oG, b: oB } = colord(originColor).toRgb();

  // 取背景色 rgb
  const { r: bgR, g: bgG, b: bgB } = colord(bgColor).toRgb();

  // 按通道计算混合：bg + (origin - bg) * alpha
  function calRgb(or: number, bg: number, al: number) {
    return bg + (or - bg) * al;
  }

  // 生成结果 rgb
  const resultRgb: RgbColor = {
    r: calRgb(oR, bgR, alpha),
    g: calRgb(oG, bgG, alpha),
    b: calRgb(oB, bgB, alpha)
  };

  // 转为 hex 返回
  return colord(resultRgb).toHex();
}

/**
 * 判断是否纯白色
 *
 * @param color 颜色
 */
export function isWhiteColor(color: AnyColor) {
  return colord(color).isEqual('#ffffff');
}

// 导出 colord 原始实例（供外部直接使用）
export { colord };
