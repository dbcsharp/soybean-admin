// 主题 Store：管理主题模式/色弱灰度/主题色与 Token、NaiveUI 主题、以及水印内容与主题配置缓存
import { computed, effectScope, onScopeDispose, ref, toRefs, watch } from 'vue';
import type { Ref } from 'vue';
import { useDateFormat, useEventListener, useNow, usePreferredColorScheme } from '@vueuse/core';
import { defineStore } from 'pinia';
import { getPaletteColorByNumber } from '@sa/color';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { useAuthStore } from '../auth';
import {
  addThemeVarsToGlobal,
  createThemeToken,
  getNaiveTheme,
  initThemeSettings,
  toggleAuxiliaryColorModes,
  toggleCssDarkMode
} from './shared';

/** Theme store */
// 创建主题 Store（中文说明：内部使用 setup 语法，配合 resetSetupStore 插件支持 $reset）
export const useThemeStore = defineStore(SetupStoreId.Theme, () => {
  // 创建独立的副作用作用域，便于统一停止 watch
  const scope = effectScope();
  // 获取系统偏好的主题（light/dark）
  const osTheme = usePreferredColorScheme();
  // 获取鉴权 Store（用于读取用户名水印）
  const authStore = useAuthStore();

  /** Theme settings */
  // 主题设置（中文说明：初始化时从本地缓存/默认配置加载）
  const settings: Ref<App.Theme.ThemeSetting> = ref(initThemeSettings());

  /** Optional NaiveUI theme overrides from preset */
  // NaiveUI 主题覆盖项（中文说明：由预设主题注入，允许覆盖自动生成主题）
  const naiveThemeOverrides: Ref<App.Theme.NaiveUIThemeOverride | undefined> = ref(undefined);

  /** Watermark time instance with controls */
  // 水印时间实例（中文说明：带 pause/resume 控制，用于只在需要时更新）
  const { now: watermarkTime, pause: pauseWatermarkTime, resume: resumeWatermarkTime } = useNow({ controls: true });

  /** Dark mode */
  // 是否暗黑模式（中文说明：auto 跟随系统，否则按 themeScheme 固定）
  const darkMode = computed(() => {
    // auto 模式跟随系统主题
    if (settings.value.themeScheme === 'auto') {
      // 系统为 dark 时返回 true
      return osTheme.value === 'dark';
      // auto 分支结束
    }
    // 非 auto 模式：themeScheme 为 dark 时返回 true
    return settings.value.themeScheme === 'dark';
    // darkMode 计算回调结束
  });

  /** grayscale mode */
  // 灰度模式开关（中文说明：用于全站灰度显示）
  const grayscaleMode = computed(() => settings.value.grayscale);

  /** colourWeakness mode */
  // 色弱模式开关（中文说明：用于辅助色弱用户）
  const colourWeaknessMode = computed(() => settings.value.colourWeakness);

  /** Theme colors */
  // 主题颜色集合（中文说明：primary + 其他色；info 可跟随 primary）
  const themeColors = computed(() => {
    // 解构主题色配置
    const { themeColor, otherColor, isInfoFollowPrimary } = settings.value;
    // 组装主题色对象
    const colors: App.Theme.ThemeColor = {
      // 主色
      primary: themeColor,
      // 其他颜色
      ...otherColor,
      // info 颜色：可配置跟随主色
      info: isInfoFollowPrimary ? themeColor : otherColor.info
      // colors 对象结束
    };
    // 返回主题色对象
    return colors;
    // themeColors 计算回调结束
  });

  /** Naive theme */
  // NaiveUI 主题配置（中文说明：根据主题色与 settings 自动生成，并合并 overrides）
  const naiveTheme = computed(() => getNaiveTheme(themeColors.value, settings.value, naiveThemeOverrides.value));

  /**
   * Settings json
   *
   * It is for copy settings
   */
  // settings 的 JSON 字符串（中文说明：用于复制主题设置）
  const settingsJson = computed(() => JSON.stringify(settings.value));

  /** Watermark time date formatter */
  // 水印时间格式化字符串（中文说明：按 watermark.timeFormat 格式化）
  const formattedWatermarkTime = computed(() => {
    // 读取 watermark 配置
    const { watermark } = settings.value;
    // 使用 dayjs-like 格式化工具格式化时间
    const date = useDateFormat(watermarkTime, watermark.timeFormat);
    // 返回格式化后的字符串
    return date.value;
    // formattedWatermarkTime 计算回调结束
  });

  /** Watermark content */
  // 水印内容（中文说明：优先用户名，其次时间，否则使用自定义文本）
  const watermarkContent = computed(() => {
    // 读取 watermark 配置
    const { watermark } = settings.value;

    // 启用用户名水印且用户存在时优先显示用户名
    if (watermark.enableUserName && authStore.userInfo.userName) {
      // 返回用户名
      return authStore.userInfo.userName;
      // enableUserName 分支结束
    }

    // 启用时间水印时显示时间
    if (watermark.enableTime) {
      // 返回格式化时间
      return formattedWatermarkTime.value;
      // enableTime 分支结束
    }

    // 默认返回自定义水印文本
    return watermark.text;
    // watermarkContent 计算回调结束
  });

  /** Reset store */
  // 重置主题 Store（中文说明：调用自身 $reset，恢复默认主题设置）
  function resetStore() {
    // 获取自身 store 实例（用于 $reset）
    const themeStore = useThemeStore();

    // 重置 store 状态
    themeStore.$reset();
    // resetStore 函数结束
  }

  /**
   * Set theme scheme
   *
   * @param themeScheme
   */
  // 设置主题模式（中文说明：light/dark/auto）
  function setThemeScheme(themeScheme: UnionKey.ThemeScheme) {
    // 写入主题模式
    settings.value.themeScheme = themeScheme;
    // setThemeScheme 函数结束
  }

  /**
   * Set grayscale value
   *
   * @param isGrayscale
   */
  // 设置灰度模式（中文说明：true 开启全站灰度）
  function setGrayscale(isGrayscale: boolean) {
    // 写入灰度开关
    settings.value.grayscale = isGrayscale;
    // setGrayscale 函数结束
  }

  /**
   * Set colourWeakness value
   *
   * @param isColourWeakness
   */
  // 设置色弱模式（中文说明：true 开启色弱辅助）
  function setColourWeakness(isColourWeakness: boolean) {
    // 写入色弱开关
    settings.value.colourWeakness = isColourWeakness;
    // setColourWeakness 函数结束
  }

  /** Toggle theme scheme */
  // 切换主题模式（中文说明：在 light/dark/auto 之间循环切换）
  function toggleThemeScheme() {
    // 主题模式候选列表
    const themeSchemes: UnionKey.ThemeScheme[] = ['light', 'dark', 'auto'];

    // 计算当前模式所在下标
    const index = themeSchemes.findIndex(item => item === settings.value.themeScheme);

    // 计算下一个下标（循环）
    const nextIndex = index === themeSchemes.length - 1 ? 0 : index + 1;

    // 取出下一个主题模式
    const nextThemeScheme = themeSchemes[nextIndex];

    // 设置新的主题模式
    setThemeScheme(nextThemeScheme);
    // toggleThemeScheme 函数结束
  }

  /**
   * Update theme colors
   *
   * @param key Theme color key
   * @param color Theme color
   */
  // 更新主题颜色（中文说明：recommendColor 开启时会用调色板推荐色替换）
  function updateThemeColors(key: App.Theme.ThemeColorKey, color: string) {
    // 默认使用传入 color
    let colorValue = color;

    // 开启推荐色时，用调色板 500 色阶作为最终颜色
    if (settings.value.recommendColor) {
      // get a color palette by provided color and color name, and use the suitable color

      // 获取推荐色（500 色阶）
      colorValue = getPaletteColorByNumber(color, 500, true);
      // recommendColor 分支结束
    }

    // primary 单独写入 themeColor，其它写入 otherColor
    if (key === 'primary') {
      // 更新主色
      settings.value.themeColor = colorValue;
    } else {
      // 更新其他颜色
      settings.value.otherColor[key] = colorValue;
      // key 分支结束
    }
    // updateThemeColors 函数结束
  }

  /**
   * Set theme layout
   *
   * @param mode Theme layout mode
   */
  // 设置布局模式（中文说明：vertical/horizontal/vertical-mix 等）
  function setThemeLayout(mode: UnionKey.ThemeLayoutMode) {
    // 写入布局模式
    settings.value.layout.mode = mode;
    // setThemeLayout 函数结束
  }

  /** Setup theme vars to global */
  // 将主题 Token 写入全局 CSS 变量（中文说明：生成亮/暗 Token，并注入到 style 标签）
  function setupThemeVarsToGlobal() {
    // 根据主题色与 token 配置生成亮/暗主题 Token
    const { themeTokens, darkThemeTokens } = createThemeToken(
      // 主题色
      themeColors.value,
      // token 配置
      settings.value.tokens,
      // 是否使用推荐色
      settings.value.recommendColor
      // createThemeToken 参数结束
    );
    // 将 Token 注入到全局 CSS 变量
    addThemeVarsToGlobal(themeTokens, darkThemeTokens);
    // setupThemeVarsToGlobal 函数结束
  }

  /**
   * Set watermark enable user name
   *
   * @param enable Whether to enable user name watermark
   */
  // 设置水印显示用户名（中文说明：开启用户名时会自动关闭时间水印）
  function setWatermarkEnableUserName(enable: boolean) {
    // 写入用户名水印开关
    settings.value.watermark.enableUserName = enable;

    // 开启用户名水印时关闭时间水印，避免冲突
    if (enable) {
      // 关闭时间水印
      settings.value.watermark.enableTime = false;
      // enable 分支结束
    }
    // setWatermarkEnableUserName 函数结束
  }

  /**
   * Set watermark enable time
   *
   * @param enable Whether to enable time watermark
   */
  // 设置水印显示时间（中文说明：开启时间时会自动关闭用户名水印）
  function setWatermarkEnableTime(enable: boolean) {
    // 写入时间水印开关
    settings.value.watermark.enableTime = enable;

    // 开启时间水印时关闭用户名水印，避免冲突
    if (enable) {
      // 关闭用户名水印
      settings.value.watermark.enableUserName = false;
      // enable 分支结束
    }
    // setWatermarkEnableTime 函数结束
  }

  /**
   * Set NaiveUI theme overrides
   *
   * @param overrides NaiveUI theme overrides or undefined to clear
   */
  // 设置 NaiveUI 主题覆盖项（中文说明：传 undefined 可清空覆盖）
  function setNaiveThemeOverrides(overrides?: App.Theme.NaiveUIThemeOverride) {
    // 写入覆盖项
    naiveThemeOverrides.value = overrides;
    // setNaiveThemeOverrides 函数结束
  }

  /** Only run timer when watermark is visible and time display is enabled */
  // 控制水印时间计时器（中文说明：仅当水印可见且启用时间时才恢复计时，否则暂停）
  function updateWatermarkTimer() {
    // 读取 watermark 配置
    const { watermark } = settings.value;
    // 判断是否需要运行计时器
    const shouldRunTimer = watermark.visible && watermark.enableTime;

    // 需要运行时恢复计时，否则暂停
    if (shouldRunTimer) {
      // 恢复水印时间更新
      resumeWatermarkTime();
    } else {
      // 暂停水印时间更新
      pauseWatermarkTime();
      // shouldRunTimer 分支结束
    }
    // updateWatermarkTimer 函数结束
  }

  /** Cache theme settings */
  // 缓存主题设置（中文说明：仅生产环境缓存到 localStorage）
  function cacheThemeSettings() {
    // 判断是否生产环境
    const isProd = import.meta.env.PROD;

    // 非生产环境不缓存
    if (!isProd) return;

    // 写入主题设置到本地缓存
    localStg.set('themeSettings', settings.value);
    // cacheThemeSettings 函数结束
  }

  // cache theme settings when page is closed or refreshed
  // 页面关闭/刷新前缓存主题设置
  useEventListener(window, 'beforeunload', () => {
    // 缓存主题设置
    cacheThemeSettings();
    // beforeunload 回调结束
  });

  // watch store
  // 在独立 scope 内注册 watch（中文说明：同步暗黑模式/辅助模式/主题色 CSS 变量/水印计时器）
  scope.run(() => {
    // watch dark mode
    // 监听暗黑模式：切换 html class，并缓存 darkMode
    watch(
      // 监听源：darkMode
      darkMode,
      // 回调：应用暗黑模式并写入缓存
      val => {
        // 切换 css 暗黑模式 class
        toggleCssDarkMode(val);
        // 缓存暗黑模式状态
        localStg.set('darkMode', val);
        // watch(darkMode) 回调结束
      },
      // 立即执行一次，保证初始状态正确
      { immediate: true }
      // watch(darkMode) 调用结束
    );

    // 监听灰度/色弱模式：应用到 html filter
    watch(
      // 监听源：灰度与色弱
      [grayscaleMode, colourWeaknessMode],
      // 回调：应用辅助色彩模式
      val => {
        // 切换辅助色彩模式
        toggleAuxiliaryColorModes(val[0], val[1]);
        // watch([grayscaleMode, colourWeaknessMode]) 回调结束
      },
      // 立即执行一次，保证初始状态正确
      { immediate: true }
      // watch([grayscaleMode, colourWeaknessMode]) 调用结束
    );

    // themeColors change, update css vars and storage theme color
    // 监听主题色变化：更新 CSS 变量并缓存主色
    watch(
      // 监听源：themeColors
      themeColors,
      // 回调：注入 CSS 变量并缓存主色
      val => {
        // 更新全局 CSS 变量
        setupThemeVarsToGlobal();
        // 缓存主色
        localStg.set('themeColor', val.primary);
        // watch(themeColors) 回调结束
      },
      // 立即执行一次，保证初始状态正确
      { immediate: true }
      // watch(themeColors) 调用结束
    );

    // watch watermark settings to control timer
    // 监听水印配置变化：控制时间计时器启停
    watch(
      // 监听源：水印可见性与时间开关
      () => [settings.value.watermark.visible, settings.value.watermark.enableTime],
      // 回调：更新计时器状态
      () => {
        // 更新水印计时器
        updateWatermarkTimer();
        // watch(watermark settings) 回调结束
      },
      // 立即执行一次，保证初始状态正确
      { immediate: true }
      // watch(watermark settings) 调用结束
    );
    // scope.run 回调结束
  });

  /** On scope dispose */
  // 作用域销毁时停止 scope（中文说明：清理所有 watch）
  onScopeDispose(() => {
    // 停止 scope 内创建的所有副作用
    scope.stop();
    // onScopeDispose 回调结束
  });

  // 对外暴露主题设置与操作方法
  return {
    // 解构 settings 为 refs（便于组件直接使用）
    ...toRefs(settings.value),
    // 暗黑模式计算值
    darkMode,
    // 主题色集合计算值
    themeColors,
    // NaiveUI 主题配置
    naiveTheme,
    // settings 的 JSON 字符串
    settingsJson,
    // 水印内容
    watermarkContent,
    // 设置灰度模式
    setGrayscale,
    // 设置色弱模式
    setColourWeakness,
    // 重置主题 store
    resetStore,
    // 设置主题模式
    setThemeScheme,
    // 切换主题模式
    toggleThemeScheme,
    // 更新主题颜色
    updateThemeColors,
    // 设置布局模式
    setThemeLayout,
    // 设置水印用户名开关
    setWatermarkEnableUserName,
    // 设置水印时间开关
    setWatermarkEnableTime,
    // 设置 NaiveUI 主题覆盖项
    setNaiveThemeOverrides
    // 返回对象定义结束
  };
  // useThemeStore setup 回调结束
});
