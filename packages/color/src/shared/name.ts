import { colorNames } from '../constant';
import { getHex, getHsl, getRgb } from './colord';

/**
 * 获取颜色名称（优先精确匹配 hex，否则按 RGB/HSL 距离找最接近的名称）
 *
 * @param color 输入颜色
 */
export function getColorName(color: string) {
  // 标准化为 hex（用于精确匹配）
  const hex = getHex(color);
  // 输入色 RGB/HSL（用于距离计算）
  const rgb = getRgb(color);
  const hsl = getHsl(color);

  // 距离计算中间变量
  let ndf = 0;
  let ndf1 = 0;
  let ndf2 = 0;
  let cl = -1;
  let df = -1;

  // 输出的颜色名称
  let name = '';

  // 遍历色名表：先尝试精确匹配，再计算距离找最接近项
  colorNames.some((item, index) => {
    const [hexValue, colorName] = item;

    // 精确匹配 hex
    const match = hex === hexValue;

    if (match) {
      name = colorName;
    } else {
      // 计算 RGB/HSL 距离
      const { r, g, b } = getRgb(hexValue);
      const { h, s, l } = getHsl(hexValue);

      ndf1 = (rgb.r - r) ** 2 + (rgb.g - g) ** 2 + (rgb.b - b) ** 2;
      ndf2 = (hsl.h - h) ** 2 + (hsl.s - s) ** 2 + (hsl.l - l) ** 2;

      // 总距离：RGB + 2*HSL（HSL 权重更高）
      ndf = ndf1 + ndf2 * 2;
      if (df < 0 || df > ndf) {
        df = ndf;
        cl = index;
      }
    }

    return match;
  });

  // 未精确命中时，取距离最小项的名称
  name = colorNames[cl][1];

  // 返回颜色名称
  return name;
}
