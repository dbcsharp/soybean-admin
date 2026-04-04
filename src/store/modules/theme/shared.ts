// 主题共享方法：负责主题设置初始化、Token/CSS 变量注入、暗黑与辅助模式切换、NaiveUI 主题生成等
import type { GlobalThemeOverrides } from 'naive-ui';
import { defu } from 'defu';
import { addColorAlpha, getColorPalette, getPaletteColorByNumber, getRgb } from '@sa/color';
import { DARK_CLASS } from '@/constants/app';
import { toggleHtmlClass } from '@/utils/common';
import { localStg } from '@/utils/storage';
import { overrideThemeSettings, themeSettings } from '@/theme/settings';
import { themeVars } from '@/theme/vars';

// 初始化主题设置（中文说明：开发环境直接用默认配置；生产环境优先从本地缓存读取，并按 overrideThemeSettings 做版本覆盖）
export function initThemeSettings() {
  // 判断是否生产环境
  const isProd = import.meta.env.PROD;

  // 开发环境不使用缓存，直接返回默认主题设置
  if (!isProd) return themeSettings;

  // 从本地缓存读取主题设置
  const localSettings = localStg.get('themeSettings');

  // 合并缓存设置与默认设置（缓存优先生效，缺省项用默认补齐）
  let settings = defu(localSettings, themeSettings);

  // 判断是否已应用过本次构建的覆盖标记
  const isOverride = localStg.get('overrideThemeFlag') === BUILD_TIME;

  // 未应用过覆盖时，合并 overrideThemeSettings 并写入标记
  if (!isOverride) {
    // 用 overrideThemeSettings 覆盖当前 settings（用于发布新版本时修正默认配置）
    settings = defu(overrideThemeSettings, settings);

    // 写入本次构建时间标记，避免重复覆盖
    localStg.set('overrideThemeFlag', BUILD_TIME);
    // if 分支结束
  }

  // 返回最终主题设置
  return settings;
  // initThemeSettings 函数结束
}

// 创建主题 Token（中文说明：根据主题色与 token 配置生成亮/暗两套 CSS Vars Token）
export function createThemeToken(
  colors: App.Theme.ThemeColor,
  tokens?: App.Theme.ThemeSetting['tokens'],
  recommended = false
) {
  // 生成调色板颜色变量（primary-50/100...等）
  const paletteColors = createThemePaletteColors(colors, recommended);

  // 解构亮/暗 token 配置（未传 tokens 时使用默认 themeSettings.tokens）
  const { light, dark } = tokens || themeSettings.tokens;

  // 生成亮色主题 Token
  const themeTokens: App.Theme.ThemeTokenCSSVars = {
    // 颜色 Token
    colors: {
      // 注入调色板颜色
      ...paletteColors,
      // nprogress 颜色使用主色
      nprogress: paletteColors.primary,
      // 合并亮色自定义颜色
      ...light.colors
      // colors 对象结束
    },
    // 阴影 Token
    boxShadow: {
      // 合并亮色阴影配置
      ...light.boxShadow
      // boxShadow 对象结束
    }
    // themeTokens 对象结束
  };

  // 生成暗色主题 Token（在亮色 Token 基础上覆盖暗色配置）
  const darkThemeTokens: App.Theme.ThemeTokenCSSVars = {
    // 颜色 Token：在亮色 Token 基础上覆盖暗色颜色
    colors: {
      // 继承亮色 colors
      ...themeTokens.colors,
      // 覆盖暗色 colors
      ...dark?.colors
      // colors 对象结束
    },
    // 阴影 Token：在亮色 Token 基础上覆盖暗色阴影
    boxShadow: {
      // 继承亮色 boxShadow
      ...themeTokens.boxShadow,
      // 覆盖暗色 boxShadow
      ...dark?.boxShadow
      // boxShadow 对象结束
    }
    // darkThemeTokens 对象结束
  };

  // 返回亮/暗 Token
  return {
    themeTokens,
    darkThemeTokens
    // 返回对象定义结束
  };
  // createThemeToken 函数结束
}

// 生成调色板颜色变量（中文说明：为每个主题色生成 -50/-100...等色阶，并保留 500 色阶作为主色）
function createThemePaletteColors(colors: App.Theme.ThemeColor, recommended = false) {
  // 获取主题色 key 列表
  const colorKeys = Object.keys(colors) as App.Theme.ThemeColorKey[];
  // 调色板变量对象
  const colorPaletteVar = {} as App.Theme.ThemePaletteColor;

  // 遍历每个颜色 key 并生成色阶
  colorKeys.forEach(key => {
    // 获取颜色调色板 Map<number, hex>
    const colorMap = getColorPalette(colors[key], recommended);

    // 500 色阶作为该颜色的主色
    colorPaletteVar[key] = colorMap.get(500)!;

    // 将所有色阶写入对象（格式：primary-50 等）
    colorMap.forEach((hex, number) => {
      // 写入单个色阶
      colorPaletteVar[`${key}-${number}`] = hex;
      // forEach 单次迭代结束
    });
    // forEach 单次迭代结束
  });

  // 返回调色板变量对象
  return colorPaletteVar;
  // createThemePaletteColors 函数结束
}

// 根据 Token 生成 CSS 变量字符串（中文说明：遍历 themeVars，将 token 值填入对应 CSS 变量）
function getCssVarByTokens(tokens: App.Theme.BaseToken) {
  // CSS 样式片段列表
  const styles: string[] = [];

  // 移除 var(...) 包装，得到实际 CSS 变量名
  function removeVarPrefix(value: string) {
    // 去掉 var( 与 )，返回变量名
    return value.replace('var(', '').replace(')', '');
    // removeVarPrefix 函数结束
  }

  // 移除 rgb(...) 包装，得到 rgb 变量名
  function removeRgbPrefix(value: string) {
    // 去掉 rgb( 与 )，返回变量名
    return value.replace('rgb(', '').replace(')', '');
    // removeRgbPrefix 函数结束
  }

  // 遍历 themeVars：key 为 tokens 的分组（colors/boxShadow 等）
  for (const [key, tokenValues] of Object.entries(themeVars)) {
    // 遍历分组下的 token 映射
    for (const [tokenKey, tokenValue] of Object.entries(tokenValues)) {
      // 计算 CSS 变量 key（默认从 tokenValue 的 var(...) 中提取）
      let cssVarsKey = removeVarPrefix(tokenValue);
      // 读取 token 值
      let cssValue = tokens[key][tokenKey];

      // colors 需要写入 rgb 三通道值（供 Tailwind/Uno 等使用）
      if (key === 'colors') {
        // 颜色变量使用 rgb 前缀规则
        cssVarsKey = removeRgbPrefix(cssVarsKey);
        // 将 hex 转为 rgb
        const { r, g, b } = getRgb(cssValue);
        // 写入 "r g b" 格式
        cssValue = `${r} ${g} ${b}`;
        // colors 分支结束
      }

      // 写入单条 CSS 变量定义
      styles.push(`${cssVarsKey}: ${cssValue}`);
      // 内层 for..of 单次迭代结束
    }
    // 外层 for..of 单次迭代结束
  }

  // 拼接为 style 字符串
  const styleStr = styles.join(';');

  // 返回 CSS 变量字符串
  return styleStr;
  // getCssVarByTokens 函数结束
}

// 将主题变量注入到全局（中文说明：生成 :root 与 html.dark 的 CSS，并写入/更新 style 标签）
export function addThemeVarsToGlobal(tokens: App.Theme.BaseToken, darkTokens: App.Theme.BaseToken) {
  // 生成亮色 CSS 变量字符串
  const cssVarStr = getCssVarByTokens(tokens);
  // 生成暗色 CSS 变量字符串
  const darkCssVarStr = getCssVarByTokens(darkTokens);

  // 亮色主题 CSS（写入 :root）
  const css = `
    :root {
      ${cssVarStr}
    }
  `;

  // 暗色主题 CSS（写入 html.dark）
  const darkCss = `
    html.${DARK_CLASS} {
      ${darkCssVarStr}
    }
  `;

  // style 标签 id（用于复用同一个标签）
  const styleId = 'theme-vars';

  // 获取已有 style 标签或创建新的 style 标签
  const style = document.querySelector(`#${styleId}`) || document.createElement('style');

  // 设置 style 标签 id
  style.id = styleId;

  // 写入 CSS 内容（亮 + 暗）
  style.textContent = css + darkCss;

  // 将 style 标签追加到 head（若已存在则移动到末尾）
  document.head.appendChild(style);
  // addThemeVarsToGlobal 函数结束
}

// 切换 CSS 暗黑模式（中文说明：通过 html class 控制暗黑变量生效）
export function toggleCssDarkMode(darkMode = false) {
  // 获取 html class 的 add/remove 方法
  const { add, remove } = toggleHtmlClass(DARK_CLASS);

  // 按 darkMode 决定添加或移除暗黑 class
  if (darkMode) {
    // 添加暗黑 class
    add();
  } else {
    // 移除暗黑 class
    remove();
    // darkMode 分支结束
  }
  // toggleCssDarkMode 函数结束
}

/**
 * Toggle auxiliary color modes
 *
 * @param grayscaleMode
 * @param colourWeakness
 */
// 切换辅助色彩模式（中文说明：通过 html filter 组合实现灰度/反色）
export function toggleAuxiliaryColorModes(grayscaleMode = false, colourWeakness = false) {
  // 获取 html 根元素
  const htmlElement = document.documentElement;
  // 根据开关组合 filter，并写入 style.filter
  htmlElement.style.filter = [grayscaleMode ? 'grayscale(100%)' : '', colourWeakness ? 'invert(80%)' : '']
    // 过滤空项
    .filter(Boolean)
    // 拼接为一个 filter 字符串
    .join(' ');
  // toggleAuxiliaryColorModes 函数结束
}

type NaiveColorScene = '' | 'Suppl' | 'Hover' | 'Pressed' | 'Active';
type NaiveColorKey = `${App.Theme.ThemeColorKey}Color${NaiveColorScene}`;
type NaiveThemeColor = Partial<Record<NaiveColorKey, string>>;
interface NaiveColorAction {
  scene: NaiveColorScene;
  handler: (color: string) => string;
}

// 生成 NaiveUI 主题颜色（中文说明：为每个主题色生成基础/悬浮/按下/激活等场景颜色）
function getNaiveThemeColors(colors: App.Theme.ThemeColor, recommended = false) {
  // 场景色处理器列表（根据 scene 生成不同色值）
  const colorActions: NaiveColorAction[] = [
    // 基础色
    { scene: '', handler: color => color },
    // 补充色
    { scene: 'Suppl', handler: color => color },
    // Hover 色：使用 500 色阶
    { scene: 'Hover', handler: color => getPaletteColorByNumber(color, 500, recommended) },
    // Pressed 色：使用 700 色阶
    { scene: 'Pressed', handler: color => getPaletteColorByNumber(color, 700, recommended) },
    // Active 色：透明度 0.1
    { scene: 'Active', handler: color => addColorAlpha(color, 0.1) }
    // colorActions 数组结束
  ];

  // NaiveUI 主题色对象
  const themeColors: NaiveThemeColor = {};

  // 将 colors 转为 entries 便于遍历
  const colorEntries = Object.entries(colors) as [App.Theme.ThemeColorKey, string][];

  // 遍历每个颜色与每个场景，生成对应的 NaiveColorKey
  colorEntries.forEach(color => {
    // 遍历场景处理器
    colorActions.forEach(action => {
      // 解构颜色类型与颜色值
      const [colorType, colorValue] = color;
      // 组装 NaiveUI 颜色 key（如 primaryColorHover）
      const colorKey: NaiveColorKey = `${colorType}Color${action.scene}`;
      // 写入对应场景的色值
      themeColors[colorKey] = action.handler(colorValue);
      // 内层 forEach 单次迭代结束
    });
    // 外层 forEach 单次迭代结束
  });

  // 返回 NaiveUI 主题色对象
  return themeColors;
  // getNaiveThemeColors 函数结束
}

// 获取 NaiveUI 主题配置（中文说明：按主题色与设置生成默认 theme，并合并 overrides）
export function getNaiveTheme(
  colors: App.Theme.ThemeColor,
  settings: App.Theme.ThemeSetting,
  overrides?: GlobalThemeOverrides
) {
  // LoadingBar 主色使用 primary
  const { primary: colorLoading } = colors;

  // 构造 NaiveUI GlobalThemeOverrides 对象
  const theme: GlobalThemeOverrides = {
    // common：注入主题色与圆角
    common: {
      // 注入 NaiveUI 场景色
      ...getNaiveThemeColors(colors, settings.recommendColor),
      // 注入全局圆角
      borderRadius: `${settings.themeRadius}px`
      // common 对象结束
    },
    // LoadingBar：注入加载条颜色
    LoadingBar: {
      // LoadingBar 颜色
      colorLoading
      // LoadingBar 对象结束
    },
    // Tag：注入标签圆角
    Tag: {
      // Tag 圆角
      borderRadius: `${settings.themeRadius}px`
      // Tag 对象结束
    }
    // theme 对象结束
  };

  // overrides 优先级更高，存在时合并覆盖
  return overrides ? defu(overrides, theme) : theme;
  // getNaiveTheme 函数结束
}
