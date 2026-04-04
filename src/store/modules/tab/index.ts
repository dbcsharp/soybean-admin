// 标签页 Store：管理多页签（新增/删除/固定/缓存/语言更新）并与路由缓存联动
import { computed, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import { defineStore } from 'pinia';
import type { RouteKey } from '@elegant-router/types';
import { router } from '@/router';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { localStg } from '@/utils/storage';
import { SetupStoreId } from '@/enum';
import { useThemeStore } from '../theme';
import {
  extractTabsByAllRoutes,
  filterTabsByIds,
  findTabByRouteName,
  getAllTabs,
  getDefaultHomeTab,
  getFixedTabIds,
  getTabByRoute,
  getTabIdByRoute,
  isTabInTabs,
  reorderFixedTabs,
  updateTabByI18nKey,
  updateTabsByI18nKey
} from './shared';

// 创建标签页 Store（内部使用 setup 语法，配合 resetSetupStore 插件支持 $reset）
export const useTabStore = defineStore(SetupStoreId.Tab, () => {
  // 获取路由 Store（用于重置路由缓存与获取首页路由 key）
  const routeStore = useRouteStore();
  // 获取主题 Store（用于判断是否缓存 tabs）
  const themeStore = useThemeStore();
  // 获取路由 push 工具（在 setup 外使用全局 router）
  const { routerPush } = useRouterPush(false);

  /** Tabs */
  // Tabs 列表（不包含 homeTab；homeTab 单独维护）
  const tabs = ref<App.Global.Tab[]>([]);

  /** Get active tab */
  // 首页 Tab（由 routeHome 生成，默认置顶）
  const homeTab = ref<App.Global.Tab>();

  /** Init home tab */
  // 初始化首页 Tab（根据 routeHome 与路由表生成 homeTab）
  function initHomeTab() {
    // 计算并写入 homeTab
    homeTab.value = getDefaultHomeTab(router, routeStore.routeHome);
  }

  /** Get all tabs */
  // 所有 Tabs（组合 homeTab + 固定 Tabs + 其他 Tabs）
  const allTabs = computed(() => getAllTabs(tabs.value, homeTab.value));

  /** Active tab id */
  // 当前激活 Tab 的 id
  const activeTabId = ref<string>('');

  /**
   * Set active tab id
   *
   * @param id Tab id
   */
  // 设置当前激活 Tab（只更新 activeTabId）
  function setActiveTabId(id: string) {
    // 更新激活 id
    activeTabId.value = id;
  }

  /**
   * Init tab store
   *
   * @param currentRoute Current route
   */
  // 初始化标签页 Store（从缓存恢复 Tabs，并把当前路由加入 Tabs）
  function initTabStore(currentRoute: App.Global.TabRoute) {
    // 从本地缓存读取 Tabs
    const storageTabs = localStg.get('globalTabs');

    // 开启缓存且缓存存在时，恢复 Tabs（并按路由表过滤无效 Tabs）
    if (themeStore.tab.cache && storageTabs) {
      // 基于当前路由表过滤缓存 Tabs
      const extractedTabs = extractTabsByAllRoutes(router, storageTabs);
      // 更新 Tabs 文案（按 i18nKey 翻译）
      tabs.value = updateTabsByI18nKey(extractedTabs);
      // if 分支结束
    }

    // 将当前路由加入 Tabs（默认激活）
    addTab(currentRoute);
  }

  /**
   * Add tab
   *
   * @param route Tab route
   * @param active Whether to activate the added tab
   */
  // 添加 Tab（非首页且不存在时才 push；active 为 true 时会激活）
  function addTab(route: App.Global.TabRoute, active = true) {
    // 由路由生成 Tab 信息
    const tab = getTabByRoute(route);

    // 判断是否为首页 Tab
    const isHomeTab = tab.id === homeTab.value?.id;

    // 非首页且未存在时加入 tabs
    if (!isHomeTab && !isTabInTabs(tab.id, tabs.value)) {
      // 追加 tab
      tabs.value.push(tab);
      // if 分支结束
    }

    // active 为 true 时设置为当前激活 tab
    if (active) {
      // 激活 tab
      setActiveTabId(tab.id);
      // active 分支结束
    }
  }

  /**
   * Remove tab
   *
   * @param tabId Tab id
   */
  // 移除指定 Tab（移除后如移除的是当前激活 Tab，则切换到相邻 Tab 或首页）
  async function removeTab(tabId: string) {
    // 查找要移除的 tab 下标
    const removeTabIndex = tabs.value.findIndex(tab => tab.id === tabId);
    // 找不到直接返回
    if (removeTabIndex === -1) return;

    // 记录被移除 Tab 的 routeKey（用于重置路由缓存）
    const removedTabRouteKey = tabs.value[removeTabIndex].routeKey;
    // 判断是否移除的是当前激活 Tab
    const isRemoveActiveTab = activeTabId.value === tabId;

    // if remove the last tab, then switch to the second last tab
    // 计算下一个要激活的 Tab：优先右侧，其次左侧，最后回到首页
    const nextTab = tabs.value[removeTabIndex + 1] || tabs.value[removeTabIndex - 1] || homeTab.value;

    // remove tab
    // 从 tabs 中移除该 tab
    tabs.value.splice(removeTabIndex, 1);

    // if current tab is removed, then switch to next tab
    // 若移除的是当前激活 Tab，则切换到 nextTab
    if (isRemoveActiveTab && nextTab) {
      // 切换路由并激活 nextTab
      await switchRouteByTab(nextTab);
      // isRemoveActiveTab 分支结束
    }

    // reset route cache
    // 重置被移除 Tab 的路由缓存
    routeStore.resetRouteCache(removedTabRouteKey);
  }

  /** remove active tab */
  // 移除当前激活 Tab（等价于 removeTab(activeTabId)）
  async function removeActiveTab() {
    // 移除激活 tab
    await removeTab(activeTabId.value);
  }

  /**
   * remove tab by route name
   *
   * @param routeName route name
   */
  // 按路由名称移除 Tab（兼容 multiTab，可能匹配多个实例）
  async function removeTabByRouteName(routeName: RouteKey) {
    // 在 tabs 中查找匹配路由的 tab
    const tab = findTabByRouteName(routeName, tabs.value);
    // 找不到直接返回
    if (!tab) return;

    // 移除找到的 tab
    await removeTab(tab.id);
  }

  /**
   * Clear tabs
   *
   * @param excludes Exclude tab ids
   */
  // 清空 Tabs（保留固定 Tabs 与 excludes 指定 Tabs；必要时切换路由并重置缓存）
  async function clearTabs(excludes: string[] = []) {
    // 需要保留的 tab id 列表：固定 tabs + excludes
    const remainTabIds = [...getFixedTabIds(tabs.value), ...excludes];

    // Identify tabs to be removed and collect their routeKeys if strategy is 'close'
    // 计算要移除的 tabs 列表
    const tabsToRemove = tabs.value.filter(tab => !remainTabIds.includes(tab.id));
    // 需要重置缓存的 routeKey 列表
    const routeKeysToReset: RouteKey[] = [];

    // 收集需要重置缓存的 routeKey
    for (const tab of tabsToRemove) {
      // 写入 routeKey
      routeKeysToReset.push(tab.routeKey);
      // for..of 单次迭代结束
    }

    // 需要移除的 tab id 列表
    const removedTabsIds = tabsToRemove.map(tab => tab.id);

    // If no tabs are actually being removed based on excludes and fixed tabs, exit
    // 若没有任何 tab 需要移除，则直接返回
    if (removedTabsIds.length === 0) {
      // 直接返回
      return;
      // 早返回分支结束
    }

    // 判断当前激活 tab 是否在移除列表中
    const isRemoveActiveTab = removedTabsIds.includes(activeTabId.value);
    // filterTabsByIds returns tabs NOT in removedTabsIds, so these are the tabs that will remain
    // 计算清理后的 tabs 列表（保留未被移除的 tabs）
    const updatedTabs = filterTabsByIds(removedTabsIds, tabs.value);

    // 更新 tabs 的内部方法（用于复用逻辑）
    function update() {
      // 写入更新后的 tabs
      tabs.value = updatedTabs;
    }

    // 若激活 tab 未被移除，直接更新列表
    if (!isRemoveActiveTab) {
      // 更新 tabs
      update();
    } else {
      // 激活 tab 被移除时，选择一个候选激活 tab（最后一个或首页）
      const activeTabCandidate = updatedTabs[updatedTabs.length - 1] || homeTab.value;

      // 候选存在时先切换到候选 tab
      if (activeTabCandidate) {
        // Ensure there's a tab to switch to
        // 切换路由并激活候选 tab
        await switchRouteByTab(activeTabCandidate);
        // activeTabCandidate 分支结束
      }
      // Update the tabs array regardless of switch success or if a candidate was found
      // 不论切换是否成功，都更新 tabs 列表
      update();
      // isRemoveActiveTab 分支结束
    }

    // After tabs are updated and route potentially switched, reset cache for removed tabs
    // 重置所有被移除 tabs 的路由缓存
    for (const routeKey of routeKeysToReset) {
      // 重置缓存
      routeStore.resetRouteCache(routeKey);
      // for..of 单次迭代结束
    }
  }

  // 在 setup 场景下使用 useRouterPush（用于 replaceTab 的路由跳转）
  const { routerPushByKey } = useRouterPush();
  /**
   * Replace tab
   *
   * @param key Route key
   * @param options Router push options
   */
  // 替换当前 Tab（先跳转新路由，再删除旧 tab（非首页/非固定））
  async function replaceTab(key: RouteKey, options?: App.Global.RouterPushOptions) {
    // 记录旧 tab id
    const oldTabId = activeTabId.value;

    // push new route
    // 跳转到新路由
    await routerPushByKey(key, options);

    // remove old tab (exclude fixed tab)
    // 若旧 tab 不需要保留，则移除旧 tab
    if (!isTabRetain(oldTabId)) {
      // 移除旧 tab
      await removeTab(oldTabId);
      // if 分支结束
    }
  }

  /**
   * Switch route by tab
   *
   * @param tab
   */
  // 根据 Tab 切换路由（routerPush 成功后同步 activeTabId）
  async function switchRouteByTab(tab: App.Global.Tab) {
    // 推送到 tab.fullPath（返回值含义由 useRouterPush 实现决定）
    const fail = await routerPush(tab.fullPath);
    // 未失败时更新激活 tab id
    if (!fail) {
      // 激活该 tab
      setActiveTabId(tab.id);
      // if 分支结束
    }
  }

  /**
   * Clear left tabs
   *
   * @param tabId
   */
  // 清除指定 Tab 左侧的 Tabs（保留该 tab 及其右侧）
  async function clearLeftTabs(tabId: string) {
    // 提取当前 tabs 的 id 列表
    const tabIds = tabs.value.map(tab => tab.id);
    // 找到指定 tab 的下标
    const index = tabIds.indexOf(tabId);
    // 找不到直接返回
    if (index === -1) return;

    // 需要保留的 id：从 index 开始到末尾
    const excludes = tabIds.slice(index);
    // 清理 tabs
    await clearTabs(excludes);
  }

  /**
   * Clear right tabs
   *
   * @param tabId
   */
  // 清除指定 Tab 右侧的 Tabs（首页特殊处理，清右侧等价于清空非固定 tabs）
  async function clearRightTabs(tabId: string) {
    // 判断是否为首页 tab
    const isHomeTab = tabId === homeTab.value?.id;
    // 首页 tab 清右侧直接清空（保留固定）
    if (isHomeTab) {
      // 清理 tabs
      clearTabs();
      // 直接返回
      return;
      // isHomeTab 分支结束
    }

    // 提取当前 tabs 的 id 列表
    const tabIds = tabs.value.map(tab => tab.id);
    // 找到指定 tab 的下标
    const index = tabIds.indexOf(tabId);
    // 找不到直接返回
    if (index === -1) return;

    // 需要保留的 id：从 0 到 index（包含 index）
    const excludes = tabIds.slice(0, index + 1);
    // 清理 tabs
    await clearTabs(excludes);
  }

  /**
   * Fix tab
   *
   * @param tabId
   */
  // 固定 Tab（设置 fixedIndex，并把该 tab 插入到固定区末尾）
  function fixTab(tabId: string) {
    // 查找 tab 下标
    const tabIndex = tabs.value.findIndex(t => t.id === tabId);
    // 找不到直接返回
    if (tabIndex === -1) return;

    // 取出 tab 引用
    const tab = tabs.value[tabIndex];
    // 计算当前固定 tabs 数量
    const fixedCount = getFixedTabIds(tabs.value).length;
    // 设置 fixedIndex 为固定区末尾
    tab.fixedIndex = fixedCount;

    // 若当前位置不等于固定区末尾，则调整位置
    if (tabIndex !== fixedCount) {
      // 先移除该 tab
      tabs.value.splice(tabIndex, 1);
      // 插入到固定区末尾
      tabs.value.splice(fixedCount, 0, tab);
      // if 分支结束
    }

    // 重排固定 tabs 的 fixedIndex，保证连续
    reorderFixedTabs(tabs.value);
  }

  /**
   * Unfix tab
   *
   * @param tabId
   */
  // 取消固定 Tab（清空 fixedIndex，并按固定区末尾位置调整顺序）
  function unfixTab(tabId: string) {
    // 查找 tab 下标
    const tabIndex = tabs.value.findIndex(t => t.id === tabId);
    // 找不到直接返回
    if (tabIndex === -1) return;

    // 取出 tab 引用
    const tab = tabs.value[tabIndex];
    // 清空 fixedIndex
    tab.fixedIndex = undefined;

    // 计算当前固定 tabs 数量
    const fixedCount = getFixedTabIds(tabs.value).length;
    // 若当前位置不等于固定区末尾，则调整位置
    if (tabIndex !== fixedCount) {
      // 先移除该 tab
      tabs.value.splice(tabIndex, 1);
      // 插入到固定区末尾（作为第一个非固定 tab）
      tabs.value.splice(fixedCount, 0, tab);
      // if 分支结束
    }

    // 重排固定 tabs 的 fixedIndex，保证连续
    reorderFixedTabs(tabs.value);
  }

  /**
   * Set new label of tab
   *
   * @default activeTabId
   * @param label New tab label
   * @param tabId Tab id
   */
  // 设置 Tab 自定义文案（保存 oldLabel 并写入 newLabel）
  function setTabLabel(label: string, tabId?: string) {
    // 计算目标 tab id（默认使用 activeTabId）
    const id = tabId || activeTabId.value;

    // 查找目标 tab
    const tab = tabs.value.find(item => item.id === id);
    // 找不到直接返回
    if (!tab) return;

    // 备份旧文案
    tab.oldLabel = tab.label;
    // 写入新文案
    tab.newLabel = label;
  }

  /**
   * Reset tab label
   *
   * @default activeTabId
   * @param tabId Tab id
   */
  // 重置 Tab 自定义文案（清空 newLabel，展示逻辑会回退到 oldLabel/label）
  function resetTabLabel(tabId?: string) {
    // 计算目标 tab id（默认使用 activeTabId）
    const id = tabId || activeTabId.value;

    // 查找目标 tab
    const tab = tabs.value.find(item => item.id === id);
    // 找不到直接返回
    if (!tab) return;

    // 清空新文案
    tab.newLabel = undefined;
  }

  /**
   * Is tab retain
   *
   * @param tabId
   */
  // 判断 Tab 是否需要保留（首页或固定 tabs 必须保留）
  function isTabRetain(tabId: string) {
    // 首页 tab 必须保留
    if (tabId === homeTab.value?.id) return true;

    // 获取固定 tabs 的 id 列表
    const fixedTabIds = getFixedTabIds(tabs.value);

    // 返回是否为固定 tab
    return fixedTabIds.includes(tabId);
  }

  /** Update tabs by locale */
  // 按语言更新 Tabs 文案（根据 i18nKey 重新翻译 label）
  function updateTabsByLocale() {
    // 更新 tabs 文案
    tabs.value = updateTabsByI18nKey(tabs.value);

    // 更新 homeTab 文案
    if (homeTab.value) {
      // 按 i18nKey 更新 homeTab
      homeTab.value = updateTabByI18nKey(homeTab.value);
      // if 分支结束
    }
  }

  /** Cache tabs */
  // 缓存 Tabs（主题开启缓存时写入 localStg.globalTabs）
  function cacheTabs() {
    // 未开启缓存时直接返回
    if (!themeStore.tab.cache) return;

    // 写入本地缓存
    localStg.set('globalTabs', tabs.value);
  }

  // cache tabs when page is closed or refreshed
  // 页面关闭/刷新前缓存 Tabs
  useEventListener(window, 'beforeunload', () => {
    // 缓存 tabs
    cacheTabs();
    // beforeunload 回调结束
  });

  // 对外暴露 Tabs 状态与操作方法
  return {
    /** All tabs */
    // 全部 tabs（包含首页/固定/其他）
    tabs: allTabs,
    // 当前激活 tab id
    activeTabId,
    // 首页 tab
    homeTab,
    // 初始化首页 tab
    initHomeTab,
    // 初始化 tab store
    initTabStore,
    // 添加 tab
    addTab,
    // 移除 tab
    removeTab,
    // 移除当前激活 tab
    removeActiveTab,
    // 按路由名移除 tab
    removeTabByRouteName,
    // 替换当前 tab
    replaceTab,
    // 清理 tabs
    clearTabs,
    // 清理左侧 tabs
    clearLeftTabs,
    // 清理右侧 tabs
    clearRightTabs,
    // 固定 tab
    fixTab,
    // 取消固定 tab
    unfixTab,
    // 按 tab 切换路由
    switchRouteByTab,
    // 设置 tab 文案
    setTabLabel,
    // 重置 tab 文案
    resetTabLabel,
    // 判断 tab 是否需要保留
    isTabRetain,
    // 按语言更新 tabs
    updateTabsByLocale,
    // 由路由获取 tab id
    getTabIdByRoute,
    // 缓存 tabs
    cacheTabs
    // 返回对象定义结束
  };
  // useTabStore setup 回调结束
});
