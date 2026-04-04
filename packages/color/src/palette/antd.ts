import type { AnyColor, HsvColor } from 'colord';
import { getHex, getHsv, isValidColor, mixColor } from '../shared';
import type { ColorIndex } from '../types';

// 色相步长
const hueStep = 2;
// 饱和度步长：亮色区
const saturationStep = 16;
// 饱和度步长：暗色区
const saturationStep2 = 5;
// 明度步长：亮色区
const brightnessStep1 = 5;
// 明度步长：暗色区
const brightnessStep2 = 15;
// 亮色数量（主色上方）
const lightColorCount = 5;
// 暗色数量（主色下方）
const darkColorCount = 4;

/**
 * 获取 Ant Design 单个调色板颜色
 *
 * @param color 输入颜色
 * @param index 色板 index（主色 index=6）
 * @returns hex 颜色
 */
export function getAntDPaletteColorByIndex(color: AnyColor, index: ColorIndex): string {
  // 非法颜色直接抛错
  if (!isValidColor(color)) {
    throw new Error('invalid input color value');
  }

  // index=6 直接返回主色
  if (index === 6) {
    return getHex(color);
  }

  // index<6 为亮色区，>6 为暗色区
  const isLight = index < 6;
  // 主色 HSV
  const hsv = getHsv(color);
  // 相对主色的距离（离 6 的步数）
  const i = isLight ? lightColorCount + 1 - index : index - lightColorCount - 1;

  // 生成新的 HSV
  const newHsv: HsvColor = {
    h: getHue(hsv, i, isLight),
    s: getSaturation(hsv, i, isLight),
    v: getValue(hsv, i, isLight)
  };

  // 返回 hex
  return getHex(newHsv);
}

// 暗色模式混合映射（中文说明：按 index 与 opacity 将色板混合到暗背景）
const darkColorMap = [
  { index: 7, opacity: 0.15 },
  { index: 6, opacity: 0.25 },
  { index: 5, opacity: 0.3 },
  { index: 5, opacity: 0.45 },
  { index: 5, opacity: 0.65 },
  { index: 5, opacity: 0.85 },
  { index: 5, opacity: 0.9 },
  { index: 4, opacity: 0.93 },
  { index: 3, opacity: 0.95 },
  { index: 2, opacity: 0.97 },
  { index: 1, opacity: 0.98 }
];

/**
 * 获取 Ant Design 调色板（11 个颜色）
 *
 * @param color 输入颜色
 * @param darkTheme 是否暗黑模式
 * @param darkThemeMixColor 暗黑混合底色（默认 #141414）
 */
export function getAntDColorPalette(color: AnyColor, darkTheme = false, darkThemeMixColor = '#141414'): string[] {
  // 色板 index（1~11，主色为 6）
  const indexes: ColorIndex[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  // 生成亮色模式色板
  const patterns = indexes.map(index => getAntDPaletteColorByIndex(color, index));

  // 暗黑模式：将色板混合到暗背景，并返回新的色板
  if (darkTheme) {
    const darkPatterns = darkColorMap.map(({ index, opacity }) => {
      const darkColor = mixColor(darkThemeMixColor, patterns[index], opacity);

      return darkColor;
    });

    return darkPatterns.map(item => getHex(item));
  }

  // 亮色模式：直接返回色板
  return patterns;
}

/**
 * 计算色相 h
 *
 * @param hsv HSV 颜色
 * @param i 相对主色的距离
 * @param isLight 是否亮色区
 */
function getHue(hsv: HsvColor, i: number, isLight: boolean) {
  let hue: number;

  const hsvH = Math.round(hsv.h);

  if (hsvH >= 60 && hsvH <= 240) {
    hue = isLight ? hsvH - hueStep * i : hsvH + hueStep * i;
  } else {
    hue = isLight ? hsvH + hueStep * i : hsvH - hueStep * i;
  }

  if (hue < 0) {
    hue += 360;
  }

  if (hue >= 360) {
    hue -= 360;
  }

  return hue;
}

/**
 * 计算饱和度 s
 *
 * @param hsv HSV 颜色
 * @param i 相对主色的距离
 * @param isLight 是否亮色区
 */
function getSaturation(hsv: HsvColor, i: number, isLight: boolean) {
  if (hsv.h === 0 && hsv.s === 0) {
    return hsv.s;
  }

  let saturation: number;

  if (isLight) {
    saturation = hsv.s - saturationStep * i;
  } else if (i === darkColorCount) {
    saturation = hsv.s + saturationStep;
  } else {
    saturation = hsv.s + saturationStep2 * i;
  }

  if (saturation > 100) {
    saturation = 100;
  }

  if (isLight && i === lightColorCount && saturation > 10) {
    saturation = 10;
  }

  if (saturation < 6) {
    saturation = 6;
  }

  return saturation;
}

/**
 * 计算明度 v
 *
 * @param hsv HSV 颜色
 * @param i 相对主色的距离
 * @param isLight 是否亮色区
 */
function getValue(hsv: HsvColor, i: number, isLight: boolean) {
  let value: number;

  if (isLight) {
    value = hsv.v + brightnessStep1 * i;
  } else {
    value = hsv.v - brightnessStep2 * i;
  }

  if (value > 100) {
    value = 100;
  }

  return value;
}
