/**
 * 调色板梯度编号
 *
 * 主色梯度为 500
 */
export type ColorPaletteNumber = 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950;

/** 调色板单色结构 */
export type ColorPalette = {
  /** 颜色 hex 值 */
  hex: string;
  /**
   * 颜色梯度编号
   *
   * - 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 950
   */
  number: ColorPaletteNumber;
};

/** 调色板家族（一个颜色名称 + 多个梯度色） */
export type ColorPaletteFamily = {
  /** 颜色家族名称 */
  name: string;
  /** 梯度色列表 */
  palettes: ColorPalette[];
};

/** 带色差（deltaE）的调色板单色 */
export type ColorPaletteWithDelta = ColorPalette & {
  /** 与输入色的色差值 */
  delta: number;
};

/** 带最近色信息的调色板家族 */
export type ColorPaletteFamilyWithNearestPalette = ColorPaletteFamily & {
  /** 色差最近的梯度色 */
  nearestPalette: ColorPaletteWithDelta;
  /** 亮度最接近的梯度色 */
  nearestLightnessPalette: ColorPaletteWithDelta;
};

/** 调色板匹配结果 */
export type ColorPaletteMatch = ColorPaletteFamily & {
  /** 调色板映射：number -> palette */
  colorMap: Map<ColorPaletteNumber, ColorPalette>;
  /**
   * 主色（500 号梯度）
   *
   * number = 500
   */
  main: ColorPalette;
  /** 输入色命中的梯度色 */
  match: ColorPalette;
};

/**
 * AntD 调色板 index
 *
 * 从浅到深依次为 1~11，其中 6 为主色
 */
export type ColorIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;
