import type { Router } from 'vue-router';
import type { LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types';
import { $t } from '@/locales';
import { getRoutePath } from '@/router/elegant/transform';

/**
 * Get all tabs
 *
 * @param tabs Tabs
 * @param homeTab Home tab
 */
// 获取全部 Tabs（按“首页 + 固定 Tabs + 其他 Tabs”排序，并应用新旧 label 覆盖逻辑）
export function getAllTabs(tabs: App.Global.Tab[], homeTab?: App.Global.Tab) {
  // 没有首页 tab 时直接返回空数组
  if (!homeTab) {
    // 返回空数组
    return [];
    // homeTab 判断分支结束
  }

  // 过滤掉首页 tab（首页 tab 会在最终数组中单独置顶）
  const filterHomeTabs = tabs.filter(tab => tab.id !== homeTab.id);

  // 固定 Tabs：筛选 fixedIndex 存在的 tab，并按 fixedIndex 升序排序
  const fixedTabs = filterHomeTabs.filter(isFixedTab).sort((a, b) => a.fixedIndex! - b.fixedIndex!);

  // 非固定 Tabs：排除 fixed tabs
  const remainTabs = filterHomeTabs.filter(tab => !isFixedTab(tab));

  // 拼接最终 Tabs 顺序：首页 + 固定 + 其他
  const allTabs = [homeTab, ...fixedTabs, ...remainTabs];

  // 返回应用 label 覆盖后的 Tabs 列表
  return updateTabsLabel(allTabs);
}

/**
 * Is fixed tab
 *
 * @param tab
 */
// 判断是否为固定 Tab（fixedIndex 不为 undefined/null 即视为固定）
function isFixedTab(tab: App.Global.Tab) {
  // 返回 fixedIndex 是否已设置
  return tab.fixedIndex !== undefined && tab.fixedIndex !== null;
}

/**
 * Get tab id by route
 *
 * @param route
 */
// 根据路由生成 Tab 唯一 id（非多开 tab 直接用 path，多开 tab 会按 query 生成唯一 id）
export function getTabIdByRoute(route: App.Global.TabRoute) {
  // 解构路由信息（query 默认空对象）
  const { path, query = {}, meta } = route;

  // 默认 id 使用 path
  let id = path;

  // multiTab 开启时，把 query 拼接到 id 中以区分不同实例
  if (meta.multiTab) {
    // 取 query 的 key 并排序，保证生成的 qs 稳定
    const queryKeys = Object.keys(query).sort();
    // 将 key=value 形式拼接为查询字符串
    const qs = queryKeys.map(key => `${key}=${query[key]}`).join('&');

    // 拼接成 path?qs 作为 tab id
    id = `${path}?${qs}`;
    // multiTab 分支结束
  }

  // 返回 tab id
  return id;
}

/**
 * Get tab by route
 *
 * @param route
 */
// 由路由生成 Tab 对象（提取 meta 标题/i18n/图标，并生成 Tab 基础信息）
export function getTabByRoute(route: App.Global.TabRoute) {
  // 解构路由字段（fullPath 不存在时使用 path）
  const { name, path, fullPath = path, meta } = route;

  // 解构 meta 中与 Tab 相关的字段
  const { title, i18nKey, fixedIndexInTab } = meta;

  // Get icon and localIcon from getRouteIcons function
  // 获取 icon 与 localIcon（避免 matched 合并 meta 导致图标污染）
  const { icon, localIcon } = getRouteIcons(route);

  // 计算 tab label：优先使用 i18nKey 翻译，否则使用 title
  const label = i18nKey ? $t(i18nKey) : title;

  // 组装 Tab 对象
  const tab: App.Global.Tab = {
    // Tab 唯一 id
    id: getTabIdByRoute(route),
    // Tab 显示文案
    label,
    // 路由 key（用于路由跳转与缓存）
    routeKey: name as LastLevelRouteKey,
    // 路由 path（用于搜索/匹配）
    routePath: path as RouteMap[LastLevelRouteKey],
    // 完整路径（用于 router.push）
    fullPath,
    // 固定位置索引（用于固定 Tabs 排序）
    fixedIndex: fixedIndexInTab,
    // 图标名称（iconify）
    icon,
    // 本地图标名称（svg-icon）
    localIcon,
    // i18n key（用于语言切换时更新 label）
    i18nKey
    // tab 对象结束
  };

  // 返回 Tab 对象
  return tab;
}

/**
 * The vue router will automatically merge the meta of all matched items, and the icons here may be affected by other
 * matching items, so they need to be processed separately
 *
 * @param route
 */
// 获取路由图标信息（从 matched 中取当前路由的 meta.icon/localIcon，避免被父级 meta 覆盖）
export function getRouteIcons(route: App.Global.TabRoute) {
  // Set default value for icon at the beginning
  // 默认 icon：优先用 route.meta.icon，否则用环境变量默认菜单图标
  let icon: string = route?.meta?.icon || import.meta.env.VITE_MENU_ICON;
  // 默认 localIcon：取 route.meta.localIcon
  let localIcon: string | undefined = route?.meta?.localIcon;

  // Route.matched only appears when there are multiple matches,so check if route.matched exists
  // matched 存在时，从 matched 中定位当前路由记录并取其 meta 图标
  if (route.matched) {
    // Find the meta of the current route from matched
    // 在 matched 中查找 name 与当前路由一致的记录
    const currentRoute = route.matched.find(r => r.name === route.name);
    // If icon exists in currentRoute.meta, it will overwrite the default value
    // 用当前路由记录中的 icon 覆盖默认 icon（若存在）
    icon = currentRoute?.meta?.icon || icon;
    // 用当前路由记录中的 localIcon 覆盖默认 localIcon
    localIcon = currentRoute?.meta?.localIcon;
    // matched 分支结束
  }

  // 返回图标信息
  return { icon, localIcon };
}

/**
 * Get default home tab
 *
 * @param router
 * @param homeRouteName routeHome in useRouteStore
 */
// 获取默认首页 Tab（根据 routeHome 生成基础 Tab，并尽量用路由表中的实际路由覆盖）
export function getDefaultHomeTab(router: Router, homeRouteName: LastLevelRouteKey) {
  // 获取首页路由 path
  const homeRoutePath = getRoutePath(homeRouteName);
  // 获取首页 i18n 文案（route.xxx）
  const i18nLabel = $t(`route.${homeRouteName}`);

  // 初始化一个基础 homeTab（后续若能在路由表中找到对应路由则替换为 getTabByRoute 的结果）
  let homeTab: App.Global.Tab = {
    // 首页 Tab id 默认使用路由 path
    id: getRoutePath(homeRouteName),
    // 首页 Tab 文案：优先 i18n 文案，否则使用 route key
    label: i18nLabel || homeRouteName,
    // 首页路由 key
    routeKey: homeRouteName,
    // 首页路由 path
    routePath: homeRoutePath,
    // 首页完整路径
    fullPath: homeRoutePath
    // homeTab 对象结束
  };

  // 获取路由表
  const routes = router.getRoutes();
  // 在路由表中查找首页路由
  const homeRoute = routes.find(route => route.name === homeRouteName);
  // 找到首页路由时，用 getTabByRoute 生成更完整的 Tab 信息
  if (homeRoute) {
    // 生成 homeTab
    homeTab = getTabByRoute(homeRoute);
    // homeRoute 分支结束
  }

  // 返回首页 Tab
  return homeTab;
}

/**
 * Is tab in tabs
 *
 * @param tab
 * @param tabs
 */
// 判断 Tab 是否已存在于 tabs 中（通过 id 精确匹配）
export function isTabInTabs(tabId: string, tabs: App.Global.Tab[]) {
  // 返回是否命中任意 tab.id
  return tabs.some(tab => tab.id === tabId);
}

/**
 * Filter tabs by id
 *
 * @param tabId
 * @param tabs
 */
// 按 id 过滤 Tabs（移除指定 id 的 tab）
export function filterTabsById(tabId: string, tabs: App.Global.Tab[]) {
  // 返回不等于 tabId 的 tab 列表
  return tabs.filter(tab => tab.id !== tabId);
}

/**
 * Filter tabs by ids
 *
 * @param tabIds
 * @param tabs
 */
// 按 id 列表过滤 Tabs（移除 tabIds 中包含的所有 tab）
export function filterTabsByIds(tabIds: string[], tabs: App.Global.Tab[]) {
  // 返回不在 tabIds 中的 tab 列表
  return tabs.filter(tab => !tabIds.includes(tab.id));
}

/**
 * extract tabs by all routes
 *
 * @param router
 * @param tabs
 */
// 根据路由表过滤 Tabs（移除不存在于当前路由表中的 tab，避免无效 tab）
export function extractTabsByAllRoutes(router: Router, tabs: App.Global.Tab[]) {
  // 获取路由表
  const routes = router.getRoutes();

  // 提取所有路由 name 列表
  const routeNames = routes.map(route => route.name);

  // 只保留 routeKey 存在于路由表的 tabs
  return tabs.filter(tab => routeNames.includes(tab.routeKey));
}

/**
 * Get fixed tabs
 *
 * @param tabs
 */
// 获取固定 Tabs（fixedIndex 存在的 tabs）
export function getFixedTabs(tabs: App.Global.Tab[]) {
  // 返回 fixed tabs
  return tabs.filter(isFixedTab);
}

/**
 * Get fixed tab ids
 *
 * @param tabs
 */
// 获取固定 Tab 的 id 列表（用于清理/保留策略）
export function getFixedTabIds(tabs: App.Global.Tab[]) {
  // 获取固定 tabs
  const fixedTabs = getFixedTabs(tabs);

  // 返回固定 tab 的 id 列表
  return fixedTabs.map(tab => tab.id);
}

/**
 * Reorder fixed tabs fixedIndex
 *
 * @param tabs
 */
// 重新排序固定 Tabs 的 fixedIndex（按当前 fixed tabs 顺序重写 fixedIndex）
export function reorderFixedTabs(tabs: App.Global.Tab[]) {
  // 获取固定 tabs
  const fixedTabs = getFixedTabs(tabs);
  // 依次写回固定索引
  fixedTabs.forEach((t, i) => {
    // 重置 fixedIndex 为当前顺序索引
    t.fixedIndex = i;
    // forEach 单次迭代结束
  });
}

/**
 * Update tabs label
 *
 * @param tabs
 */
// 更新 Tabs 的 label（优先 newLabel，其次 oldLabel，最后使用原 label）
function updateTabsLabel(tabs: App.Global.Tab[]) {
  // 生成更新后的 tabs 列表
  const updated = tabs.map(tab => ({
    // 保留 tab 其他字段
    ...tab,
    // label 覆盖优先级：newLabel > oldLabel > label
    label: tab.newLabel || tab.oldLabel || tab.label
    // 单个 tab 映射结果结束
  }));

  // 返回更新后的列表
  return updated;
}

/**
 * Update tab by i18n key
 *
 * @param tab
 */
// 根据 i18nKey 更新单个 Tab 文案（有 i18nKey 则翻译，否则保持原 label）
export function updateTabByI18nKey(tab: App.Global.Tab) {
  // 解构 tab 的 i18nKey 与 label
  const { i18nKey, label } = tab;

  // 返回更新后的 tab 对象
  return {
    // 保留原 tab 字段
    ...tab,
    // label：按 i18nKey 翻译或使用原 label
    label: i18nKey ? $t(i18nKey) : label
    // 返回对象结束
  };
}

/**
 * Update tabs by i18n key
 *
 * @param tabs
 */
// 批量按 i18nKey 更新 Tabs 文案（对每个 tab 应用 updateTabByI18nKey）
export function updateTabsByI18nKey(tabs: App.Global.Tab[]) {
  // 返回映射后的 tabs
  return tabs.map(tab => updateTabByI18nKey(tab));
}

/**
 * find tab by route name
 *
 * @param name
 * @param tabs
 */
// 根据路由名称查找 Tab（兼容 multiTab，匹配 id 等于 routePath 或以 routePath? 开头）
export function findTabByRouteName(name: RouteKey, tabs: App.Global.Tab[]) {
  // 获取路由 path
  const routePath = getRoutePath(name);

  // 单 tab 的 id
  const tabId = routePath;
  // multiTab 的 id 前缀（带 ?）
  const multiTabId = `${routePath}?`;

  // 返回匹配的 tab
  return tabs.find(tab => tab.id === tabId || tab.id.startsWith(multiTabId));
}
