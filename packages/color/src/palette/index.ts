import type { AnyColor } from 'colord';
import { getHex } from '../shared';
import type { ColorPaletteNumber } from '../types';
import { getRecommendedColorPalette } from './recommend';
import { getAntDColorPalette } from './antd';

/**
 * 获取颜色调色板（中文说明：按给定颜色生成 50~950 梯度色映射）
 *
 * @param color 颜色（colord AnyColor）
 * @param recommended 是否启用推荐算法（输入色可能不是 500 主色）
 */
export function getColorPalette(color: AnyColor, recommended = false) {
  // number -> hex 的映射
  const colorMap = new Map<ColorPaletteNumber, string>();

  // 推荐算法：基于预置色板 + deltaE + HSL 调整生成梯度
  if (recommended) {
    const colorPalette = getRecommendedColorPalette(getHex(color));
    colorPalette.palettes.forEach(palette => {
      colorMap.set(palette.number, palette.hex);
    });
  } else {
    // AntD 算法：从主色生成 1~11 号色板（映射到 50~950）
    const colors = getAntDColorPalette(color);

    const colorNumbers: ColorPaletteNumber[] = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

    colorNumbers.forEach((number, index) => {
      colorMap.set(number, colors[index]);
    });
  }

  // 返回梯度色映射
  return colorMap;
}

/**
 * 按 number 获取调色板颜色
 *
 * @param color 输入颜色
 * @param number 调色板梯度（50~950）
 * @param recommended 是否启用推荐算法
 */
export function getPaletteColorByNumber(color: AnyColor, number: ColorPaletteNumber, recommended = false) {
  // 先生成调色板映射
  const colorMap = getColorPalette(color, recommended);

  // 返回对应梯度颜色（确保存在）
  return colorMap.get(number as ColorPaletteNumber)!;
}
