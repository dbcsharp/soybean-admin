import { getColorName, getDeltaE, getHsl, isValidColor, transformHslToHex } from '../shared';
import { colorPalettes } from '../constant';
import type {
  ColorPalette,
  ColorPaletteFamily,
  ColorPaletteFamilyWithNearestPalette,
  ColorPaletteMatch,
  ColorPaletteNumber
} from '../types';

/**
 * 获取推荐调色板（根据输入颜色计算最接近的色板家族，并调整色相/饱和度生成梯度）
 *
 * @param color 输入颜色（hex）
 */
export function getRecommendedColorPalette(color: string) {
  // 获取推荐的色板家族（包含 50~950 梯度）
  const colorPaletteFamily = getRecommendedColorPaletteFamily(color);

  // number -> palette 的映射
  const colorMap = new Map<ColorPaletteNumber, ColorPalette>();

  // 填充映射
  colorPaletteFamily.palettes.forEach(palette => {
    colorMap.set(palette.number, palette);
  });

  // 500 号色作为主色
  const mainColor = colorMap.get(500)!;
  // 输入色命中的 palette（用于记录 match）
  const matchColor = colorPaletteFamily.palettes.find(palette => palette.hex === color)!;

  // 组合输出结构：包含 colorMap/main/match 等字段
  const colorPalette: ColorPaletteMatch = {
    ...colorPaletteFamily,
    colorMap,
    main: mainColor,
    match: matchColor
  };

  return colorPalette;
}

/**
 * 按 number 获取推荐调色板颜色
 *
 * @param color 输入颜色（hex）
 * @param number 调色板梯度（50~950）
 */
export function getRecommendedPaletteColorByNumber(color: string, number: ColorPaletteNumber) {
  // 获取完整推荐调色板
  const colorPalette = getRecommendedColorPalette(color);

  // 从映射中取出对应 hex
  const { hex } = colorPalette.colorMap.get(number)!;

  return hex;
}

/**
 * 获取推荐色板家族（在预置色板中寻找最接近颜色，并按输入色调整整套梯度）
 *
 * @param color 输入颜色（hex）
 */
export function getRecommendedColorPaletteFamily(color: string) {
  // 非法颜色直接抛错
  if (!isValidColor(color)) {
    throw new Error('Invalid color, please check color value!');
  }

  // 获取颜色名称（例如 "Deep Sky Blue"）
  let colorName = getColorName(color);

  // 规范化名称：转小写并用 - 连接
  colorName = colorName.toLowerCase().replace(/\s/g, '-');

  // 输入颜色的 h/s
  const { h: h1, s: s1 } = getHsl(color);

  // 在预置色板中找到最接近的色板家族，并返回最接近亮度的 palette
  const { nearestLightnessPalette, palettes } = getNearestColorPaletteFamily(color, colorPalettes);

  // 记录命中的 palette（用于计算 deltaH 与饱和度比例）
  const { number, hex } = nearestLightnessPalette;

  // 命中 palette 的 h/s
  const { h: h2, s: s2 } = getHsl(hex);

  // 色相差值
  const deltaH = h1 - h2;

  // 饱和度比例（用于整体缩放）
  const sRatio = s1 / s2;

  // 生成新的色板家族：对每个梯度色做 H/S 调整，并保持原 l（亮度）不变
  const colorPaletteFamily: ColorPaletteFamily = {
    name: colorName,
    palettes: palettes.map(palette => {
      let hexValue = color;

      // 命中的梯度直接使用输入色
      const isSame = number === palette.number;

      if (!isSame) {
        // 其它梯度：基于原梯度色做 H/S 调整
        const { h: h3, s: s3, l } = getHsl(palette.hex);

        const newH = deltaH < 0 ? h3 + deltaH : h3 - deltaH;
        const newS = s3 * sRatio;

        hexValue = transformHslToHex({
          h: newH,
          s: newS,
          l
        });
      }

      // 返回该梯度色
      return {
        hex: hexValue,
        number: palette.number
      };
    })
  };

  return colorPaletteFamily;
}

/**
 * 获取最接近的色板家族（先按 deltaE 找最近家族，再按亮度 l 找最近梯度）
 *
 * @param color 输入颜色
 * @param families 预置色板家族
 */
function getNearestColorPaletteFamily(color: string, families: ColorPaletteFamily[]) {
  // 为每个家族计算每个梯度与输入色的 deltaE，并选出最近梯度
  const familyWithConfig = families.map(family => {
    const palettes = family.palettes.map(palette => {
      return {
        ...palette,
        delta: getDeltaE(color, palette.hex)
      };
    });

    // 按 deltaE 选出最近的 palette
    const nearestPalette = palettes.reduce((prev, curr) => (prev.delta < curr.delta ? prev : curr));

    return {
      ...family,
      palettes,
      nearestPalette
    };
  });

  // 在所有家族中选出最近家族
  const nearestPaletteFamily = familyWithConfig.reduce((prev, curr) =>
    prev.nearestPalette.delta < curr.nearestPalette.delta ? prev : curr
  );

  // 输入色亮度 l
  const { l } = getHsl(color);

  // 在最近家族中按亮度选择最接近的梯度色
  const paletteFamily: ColorPaletteFamilyWithNearestPalette = {
    ...nearestPaletteFamily,
    nearestLightnessPalette: nearestPaletteFamily.palettes.reduce((prev, curr) => {
      const { l: prevLightness } = getHsl(prev.hex);
      const { l: currLightness } = getHsl(curr.hex);

      const deltaPrev = Math.abs(prevLightness - l);
      const deltaCurr = Math.abs(currLightness - l);

      return deltaPrev < deltaCurr ? prev : curr;
    })
  };

  return paletteFamily;
}
