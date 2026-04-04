import { effectScope, nextTick, onScopeDispose, ref, watch } from 'vue';
import { breakpointsTailwind, useBreakpoints, useEventListener, useTitle } from '@vueuse/core';
import { defineStore } from 'pinia';
import { useBoolean } from '@sa/hooks';
import { router } from '@/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { $t, setLocale } from '@/locales';
import { setDayjsLocale } from '@/locales/dayjs';
import { useRouteStore } from '../route';
import { useTabStore } from '../tab';
import { useThemeStore } from '../theme';

// 应用状态 Store：管理布局响应式（移动端/侧边栏）、主题抽屉、页面重载标记、语言切换等全局状态
export const useAppStore = defineStore(SetupStoreId.App, () => {
  // 获取主题 Store（用于读取主题配置与设置布局）
  const themeStore = useThemeStore();
  // 获取路由 Store（用于重置路由缓存与更新菜单）
  const routeStore = useRouteStore();
  // 获取标签页 Store（用于更新标签页 i18n 与缓存标签页）
  const tabStore = useTabStore();
  // 创建独立的副作用作用域，便于统一停止 watch
  const scope = effectScope();
  // 创建 Tailwind 断点对象（用于判断移动端）
  const breakpoints = useBreakpoints(breakpointsTailwind);
  // 主题设置抽屉显隐状态与控制方法
  const { bool: themeDrawerVisible, setTrue: openThemeDrawer, setFalse: closeThemeDrawer } = useBoolean();
  // 页面重载标记（用于触发页面重新挂载/刷新）
  const { bool: reloadFlag, setBool: setReloadFlag } = useBoolean(true);
  // 全屏内容模式（用于隐藏侧边/头部等，仅展示内容区）
  const { bool: fullContent, toggle: toggleFullContent } = useBoolean();
  // 内容区横向滚动标记（用于控制某些布局下内容可横向滚动）
  const { bool: contentXScrollable, setBool: setContentXScrollable } = useBoolean();
  // 侧边栏折叠状态与控制方法
  const { bool: siderCollapse, setBool: setSiderCollapse, toggle: toggleSiderCollapse } = useBoolean();
  // 混合侧边栏固定状态与控制方法（默认值从本地缓存读取）
  const {
    // 混合侧边栏是否固定
    bool: mixSiderFixed,
    // 设置混合侧边栏固定状态
    setBool: setMixSiderFixed,
    // 切换混合侧边栏固定状态
    toggle: toggleMixSiderFixed
    // useBoolean 解构结束
  } = useBoolean(localStg.get('mixSiderFixed') === 'Y');

  /** Is mobile layout */
  // 是否移动端布局（中文说明：小于 sm 断点时为移动端）
  const isMobile = breakpoints.smaller('sm');

  /**
   * Reload page
   *
   * @param duration Duration time
   */
  // 触发页面重载（中文说明：先关闭 reloadFlag，再按动画配置延迟后重新打开，并重置路由缓存）
  async function reloadPage(duration = 300) {
    // 先关闭重载标记，让页面卸载
    setReloadFlag(false);

    // 根据是否启用页面动画决定延迟时间
    const d = themeStore.page.animate ? duration : 40;

    // 延迟一段时间，保证卸载/过渡完成
    await new Promise(resolve => {
      // 使用 setTimeout 实现延迟
      setTimeout(resolve, d);
      // Promise executor 结束
    });

    // 重新开启重载标记，让页面重新挂载
    setReloadFlag(true);
    // 重置当前路由缓存（用于 keep-alive 场景刷新）
    routeStore.resetRouteCache();
    // reloadPage 函数结束
  }

  // 当前语言（中文说明：从本地读取 lang，不存在则默认 zh-CN）
  const locale = ref<App.I18n.LangType>(localStg.get('lang') || 'zh-CN');

  // 语言选项列表（用于语言切换下拉）
  const localeOptions: App.I18n.LangOption[] = [
    // 中文选项
    {
      // 展示文本
      label: '中文',
      // 语言 key
      key: 'zh-CN'
      // 单个选项结束
    },
    // 英文选项
    {
      // 展示文本
      label: 'English',
      // 语言 key
      key: 'en-US'
      // 单个选项结束
    }
    // localeOptions 数组结束
  ];

  // 切换语言（中文说明：更新 locale、更新 i18n、并写入本地缓存）
  function changeLocale(lang: App.I18n.LangType) {
    // 更新响应式语言值
    locale.value = lang;
    // 更新全局 i18n 语言
    setLocale(lang);
    // 缓存语言选择
    localStg.set('lang', lang);
    // changeLocale 函数结束
  }

  /** Update document title by locale */
  // 根据语言更新浏览器标题（中文说明：优先使用 i18nKey 翻译，否则使用路由 meta.title）
  function updateDocumentTitleByLocale() {
    // 从当前路由 meta 中读取 i18nKey 与 title
    const { i18nKey, title } = router.currentRoute.value.meta;

    // 生成 documentTitle（有 i18nKey 则翻译，否则直接用 title）
    const documentTitle = i18nKey ? $t(i18nKey) : title;

    // 设置浏览器标题
    useTitle(documentTitle);
    // updateDocumentTitleByLocale 函数结束
  }

  // 初始化应用状态（中文说明：设置 dayjs 的语言）
  function init() {
    // 设置 dayjs 语言
    setDayjsLocale(locale.value);
    // init 函数结束
  }

  // watch store
  // 在独立 scope 内注册 watch（中文说明：监听移动端变化与语言变化）
  scope.run(() => {
    // watch isMobile, if is mobile, collapse sider
    // 监听 isMobile：进入移动端时备份布局并强制切换为竖向布局且折叠侧边栏；退出移动端时恢复备份
    watch(
      // 监听源：isMobile
      isMobile,
      // 回调：根据是否移动端执行布局切换
      newValue => {
        // 进入移动端
        if (newValue) {
          // backup theme setting before is mobile
          // 备份移动端切换前的布局与侧边栏折叠状态
          localStg.set('backupThemeSettingBeforeIsMobile', {
            // 备份布局模式
            layout: themeStore.layout.mode,
            // 备份侧边栏折叠状态
            siderCollapse: siderCollapse.value
            // 备份对象结束
          });

          // 切换为竖向布局
          themeStore.setThemeLayout('vertical');
          // 折叠侧边栏
          setSiderCollapse(true);
        } else {
          // 退出移动端时恢复备份的主题布局设置
          // 退出移动端时读取备份的主题布局设置
          const backup = localStg.get('backupThemeSettingBeforeIsMobile');

          // 有备份时恢复
          if (backup) {
            // nextTick 保证布局切换在 DOM 更新后执行
            nextTick(() => {
              // 恢复布局模式
              themeStore.setThemeLayout(backup.layout);
              // 恢复侧边栏折叠状态
              setSiderCollapse(backup.siderCollapse);

              // 清除备份缓存
              localStg.remove('backupThemeSettingBeforeIsMobile');
              // nextTick 回调结束
            });
            // backup 判断分支结束
          }
          // newValue 判断分支结束
        }
        // watch(isMobile) 回调结束
      },
      // 立即执行一次，保证初始布局与状态正确
      { immediate: true }
      // watch(isMobile) 调用结束
    );

    // watch locale
    // 监听语言变化：更新标题、更新菜单与标签页、同步 dayjs 语言
    watch(locale, () => {
      // update document title by locale
      // 更新浏览器标题
      updateDocumentTitleByLocale();

      // update global menus by locale
      // 语言变化时刷新全局菜单文案
      routeStore.updateGlobalMenusByLocale();

      // update tabs by locale
      // 语言变化时刷新标签页文案
      tabStore.updateTabsByLocale();

      // set dayjs locale
      // 同步 dayjs 语言
      setDayjsLocale(locale.value);
      // watch(locale) 回调结束
    });
    // scope.run 回调结束
  });

  // cache mixSiderFixed
  // 页面关闭/刷新前缓存 mixSiderFixed 状态（中文说明：写入本地存储）
  useEventListener(window, 'beforeunload', () => {
    // 将布尔值转换为 Y/N 写入缓存
    localStg.set('mixSiderFixed', mixSiderFixed.value ? 'Y' : 'N');
    // beforeunload 回调结束
  });

  /** On scope dispose */
  // 作用域销毁时停止 scope（中文说明：清理所有 watch）
  onScopeDispose(() => {
    // 停止 scope 内创建的所有副作用
    scope.stop();
    // onScopeDispose 回调结束
  });

  // init
  // 执行初始化逻辑
  init();

  // 对外暴露应用状态与操作方法
  return {
    // 是否移动端
    isMobile,
    // 页面重载标记
    reloadFlag,
    // 重载页面方法
    reloadPage,
    // 是否全屏内容模式
    fullContent,
    // 当前语言
    locale,
    // 语言选项列表
    localeOptions,
    // 切换语言方法
    changeLocale,
    // 主题抽屉可见状态
    themeDrawerVisible,
    // 打开主题抽屉方法
    openThemeDrawer,
    // 关闭主题抽屉方法
    closeThemeDrawer,
    // 切换全屏内容模式
    toggleFullContent,
    // 内容区横向滚动标记
    contentXScrollable,
    // 设置内容区横向滚动标记
    setContentXScrollable,
    // 侧边栏折叠状态
    siderCollapse,
    // 设置侧边栏折叠状态
    setSiderCollapse,
    // 切换侧边栏折叠状态
    toggleSiderCollapse,
    // 混合侧边栏是否固定
    mixSiderFixed,
    // 设置混合侧边栏固定状态
    setMixSiderFixed,
    // 切换混合侧边栏固定状态
    toggleMixSiderFixed
    // 返回对象定义结束
  };
  // useAppStore setup 回调结束
});
