// 路由共享方法：提供权限路由过滤、路由排序、菜单/面包屑/搜索菜单生成、路由缓存提取等能力
import type { RouteLocationNormalizedLoaded, RouteRecordRaw, _RouteRecordBase } from 'vue-router';
import type { ElegantConstRoute, LastLevelRouteKey, RouteKey, RouteMap } from '@elegant-router/types';
import { useSvgIcon } from '@/hooks/common/icon';
import { $t } from '@/locales';

/**
 * Filter auth routes by roles
 *
 * @param routes Auth routes
 * @param roles Roles
 */
// 按角色过滤权限路由（中文说明：递归过滤 children，并按 meta.roles 判断是否可访问）
export function filterAuthRoutesByRoles(routes: ElegantConstRoute[], roles: string[]) {
  // 使用 flatMap 展开过滤结果（递归函数返回数组）
  return routes.flatMap(route => filterAuthRouteByRoles(route, roles));
  // filterAuthRoutesByRoles 函数结束
}

/**
 * Filter auth route by roles
 *
 * @param route Auth route
 * @param roles Roles
 */
// 递归过滤单条权限路由（中文说明：无 roles 限制则可访问；否则需要命中任意角色；children 也会递归过滤）
function filterAuthRouteByRoles(route: ElegantConstRoute, roles: string[]): ElegantConstRoute[] {
  // 路由允许访问的角色列表（不存在则为空数组）
  const routeRoles = (route.meta && route.meta.roles) || [];

  // if the route's "roles" is empty, then it is allowed to access
  // roles 为空代表无需权限限制
  const isEmptyRoles = !routeRoles.length;

  // if the user's role is included in the route's "roles", then it is allowed to access
  // 用户角色命中路由 roles 时认为有权限
  const hasPermission = routeRoles.some(role => roles.includes(role));

  // 拷贝一份路由对象（避免直接修改原路由）
  const filterRoute = { ...route };

  // 存在 children 时递归过滤 children
  if (filterRoute.children?.length) {
    // 用 flatMap 递归过滤子路由并重新赋值
    filterRoute.children = filterRoute.children.flatMap(item => filterAuthRouteByRoles(item, roles));
    // if 分支结束
  }

  // Exclude the route if it has no children after filtering
  // children 过滤后为空数组时，直接排除该路由（避免出现空菜单/空路由节点）
  if (filterRoute.children?.length === 0) {
    // 返回空数组表示排除
    return [];
    // 早返回分支结束
  }

  // 有权限或无需角色限制时保留该路由，否则排除
  return hasPermission || isEmptyRoles ? [filterRoute] : [];
  // filterAuthRouteByRoles 函数结束
}

/**
 * sort route by order
 *
 * @param route route
 */
// 递归按 meta.order 排序路由 children（中文说明：order 越小越靠前）
function sortRouteByOrder(route: ElegantConstRoute) {
  // 存在子路由时对 children 排序并递归处理
  if (route.children?.length) {
    // 按 meta.order 升序排序
    route.children.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0));
    // 递归排序子路由
    route.children.forEach(sortRouteByOrder);
    // if 分支结束
  }

  // 返回排序后的 route
  return route;
  // sortRouteByOrder 函数结束
}

/**
 * sort routes by order
 *
 * @param routes routes
 */
// 对路由数组按 meta.order 排序（中文说明：先排序顶层，再递归排序 children）
export function sortRoutesByOrder(routes: ElegantConstRoute[]) {
  // 排序顶层 routes
  routes.sort((next, prev) => (Number(next.meta?.order) || 0) - (Number(prev.meta?.order) || 0));
  // 递归排序子路由
  routes.forEach(sortRouteByOrder);

  // 返回排序后的 routes
  return routes;
  // sortRoutesByOrder 函数结束
}

/**
 * Get global menus by auth routes
 *
 * @param routes Auth routes
 */
// 由权限路由生成全局菜单（中文说明：过滤 hideInMenu，并递归生成 children 菜单）
export function getGlobalMenusByAuthRoutes(routes: ElegantConstRoute[]) {
  // 菜单结果数组
  const menus: App.Global.Menu[] = [];

  // 遍历路由并生成菜单
  routes.forEach(route => {
    // hideInMenu 为 false 时才生成菜单
    if (!route.meta?.hideInMenu) {
      // 将单条路由转换为菜单对象
      const menu = getGlobalMenuByBaseRoute(route);

      // children 中存在可显示菜单的子路由时递归生成子菜单
      if (route.children?.some(child => !child.meta?.hideInMenu)) {
        // 递归生成 children 菜单
        menu.children = getGlobalMenusByAuthRoutes(route.children);
        // if 分支结束
      }

      // 推入菜单结果
      menus.push(menu);
      // hideInMenu 分支结束
    }
    // forEach 单次迭代结束
  });

  // 返回菜单数组
  return menus;
  // getGlobalMenusByAuthRoutes 函数结束
}

/**
 * Update locale of global menus
 *
 * @param menus
 */
// 按语言更新菜单文案（中文说明：i18nKey 存在时重新翻译 label，并递归处理 children）
export function updateLocaleOfGlobalMenus(menus: App.Global.Menu[]) {
  // 新菜单数组
  const result: App.Global.Menu[] = [];

  // 遍历菜单并更新 label
  menus.forEach(menu => {
    // 解构菜单字段
    const { i18nKey, label, children } = menu;

    // 计算新 label：优先翻译 i18nKey，否则使用原 label
    const newLabel = i18nKey ? $t(i18nKey) : label;

    // 构造新菜单对象
    const newMenu: App.Global.Menu = {
      // 继承原菜单字段
      ...menu,
      // 覆盖 label
      label: newLabel
      // newMenu 对象结束
    };

    // 存在子菜单时递归更新
    if (children?.length) {
      // 递归更新 children
      newMenu.children = updateLocaleOfGlobalMenus(children);
      // if 分支结束
    }

    // 推入结果数组
    result.push(newMenu);
    // forEach 单次迭代结束
  });

  // 返回更新后的菜单数组
  return result;
  // updateLocaleOfGlobalMenus 函数结束
}

/**
 * Get global menu by route
 *
 * @param route
 */
// 将路由转换为菜单对象（中文说明：生成 key/label/routeKey/routePath，并生成图标 VNode）
function getGlobalMenuByBaseRoute(route: RouteLocationNormalizedLoaded | ElegantConstRoute) {
  // 获取 SvgIconVNode 渲染函数
  const { SvgIconVNode } = useSvgIcon();

  // 解构路由 name 与 path
  const { name, path } = route;
  // 解构 meta 中的标题/i18n/图标配置
  const { title, i18nKey, icon = import.meta.env.VITE_MENU_ICON, localIcon, iconFontSize } = route.meta ?? {};

  // 计算菜单 label：优先 i18nKey 翻译，否则使用 title
  const label = i18nKey ? $t(i18nKey) : title!;

  // 构造菜单对象
  const menu: App.Global.Menu = {
    // 菜单 key：使用路由 name
    key: name as string,
    // 菜单显示文案
    label,
    // i18n key（用于语言切换）
    i18nKey,
    // 路由 key（用于跳转）
    routeKey: name as RouteKey,
    // 路由 path（用于跳转/匹配）
    routePath: path as RouteMap[RouteKey],
    // 菜单图标（渲染 VNode）
    icon: SvgIconVNode({ icon, localIcon, fontSize: iconFontSize || 20 })
    // menu 对象结束
  };

  // 返回菜单对象
  return menu;
  // getGlobalMenuByBaseRoute 函数结束
}

/**
 * Get cache route names
 *
 * @param routes Vue routes (two levels)
 */
// 提取需要 keep-alive 缓存的路由 name（中文说明：仅处理两级路由结构，并要求 child.component 与 keepAlive）
export function getCacheRouteNames(routes: RouteRecordRaw[]) {
  // 缓存路由 name 列表
  const cacheNames: LastLevelRouteKey[] = [];

  // 遍历两级路由
  routes.forEach(route => {
    // only get last two level route, which has component
    // 遍历子路由并提取满足条件的 name
    route.children?.forEach(child => {
      // 有 component 且 keepAlive 为 true 时加入缓存列表
      if (child.component && child.meta?.keepAlive) {
        // 推入缓存路由 name
        cacheNames.push(child.name as LastLevelRouteKey);
        // if 分支结束
      }
      // forEach 单次迭代结束
    });
    // forEach 单次迭代结束
  });

  // 返回缓存路由 name 列表
  return cacheNames;
  // getCacheRouteNames 函数结束
}

/**
 * Is route exist by route name
 *
 * @param routeName
 * @param routes
 */
// 判断路由是否存在（中文说明：递归遍历路由树，匹配 name）
export function isRouteExistByRouteName(routeName: RouteKey, routes: ElegantConstRoute[]) {
  // 任意一条路由递归命中则认为存在
  return routes.some(route => recursiveGetIsRouteExistByRouteName(route, routeName));
  // isRouteExistByRouteName 函数结束
}

/**
 * Recursive get is route exist by route name
 *
 * @param route
 * @param routeName
 */
// 递归判断路由树中是否存在指定 name（中文说明：先判断自身，再递归 children）
function recursiveGetIsRouteExistByRouteName(route: ElegantConstRoute, routeName: RouteKey) {
  // 是否命中当前路由
  let isExist = route.name === routeName;

  // 命中则直接返回 true
  if (isExist) {
    // 返回 true
    return true;
    // 早返回分支结束
  }

  // 存在 children 时递归判断
  if (route.children && route.children.length) {
    // 递归 children
    isExist = route.children.some(item => recursiveGetIsRouteExistByRouteName(item, routeName));
    // if 分支结束
  }

  // 返回递归结果
  return isExist;
  // recursiveGetIsRouteExistByRouteName 函数结束
}

/**
 * Get selected menu key path
 *
 * @param selectedKey
 * @param menus
 */
// 获取选中菜单的 keyPath（中文说明：返回从根到目标菜单的 key 链路）
export function getSelectedMenuKeyPathByKey(selectedKey: string, menus: App.Global.Menu[]) {
  // keyPath 结果数组
  const keyPath: string[] = [];

  // 遍历菜单树并查找路径（some 用于提前结束遍历）
  menus.some(menu => {
    // 查找当前 menu 下的路径
    const path = findMenuPath(selectedKey, menu);

    // 是否找到路径
    const find = Boolean(path?.length);

    // 找到时将路径写入 keyPath
    if (find) {
      // 展开写入路径数组
      keyPath.push(...path!);
      // if 分支结束
    }

    // 返回 find 用于 some 提前结束
    return find;
    // some 单次迭代结束
  });

  // 返回 keyPath
  return keyPath;
  // getSelectedMenuKeyPathByKey 函数结束
}

/**
 * Find menu path
 *
 * @param targetKey Target menu key
 * @param menu Menu
 */
// 查找目标菜单的路径（中文说明：DFS 搜索，找到后返回 key 数组，否则返回 null）
function findMenuPath(targetKey: string, menu: App.Global.Menu): string[] | null {
  // 当前 DFS 路径栈
  const path: string[] = [];

  // 深度优先搜索函数（返回是否找到目标）
  function dfs(item: App.Global.Menu): boolean {
    // 入栈当前节点 key
    path.push(item.key);

    // 命中目标 key
    if (item.key === targetKey) {
      // 返回 true 表示已找到
      return true;
      // 早返回分支结束
    }

    // 存在 children 时继续递归
    if (item.children) {
      // 遍历子节点
      for (const child of item.children) {
        // 子树命中则直接返回 true
        if (dfs(child)) {
          // 返回 true
          return true;
          // 早返回分支结束
        }
        // for..of 单次迭代结束
      }
      // if 分支结束
    }

    // 回溯：弹出当前节点 key
    path.pop();

    // 返回 false 表示未找到
    return false;
    // dfs 函数结束
  }

  // 从当前 menu 作为根开始 DFS，命中则返回路径
  if (dfs(menu)) {
    // 返回路径副本（path 当前即为最终路径）
    return path;
    // if 分支结束
  }

  // 未找到返回 null
  return null;
  // findMenuPath 函数结束
}

/**
 * Transform menu to breadcrumb
 *
 * @param menu
 */
// 将菜单转换为面包屑节点（中文说明：children 会映射为 options）
function transformMenuToBreadcrumb(menu: App.Global.Menu) {
  // 解构 children，其余字段作为面包屑节点字段
  const { children, ...rest } = menu;

  // 构造面包屑对象
  const breadcrumb: App.Global.Breadcrumb = {
    // 继承菜单基础字段
    ...rest
    // breadcrumb 对象结束
  };

  // 存在 children 时递归转换为 options
  if (children?.length) {
    // 递归转换子菜单为面包屑 options
    breadcrumb.options = children.map(transformMenuToBreadcrumb);
    // if 分支结束
  }

  // 返回面包屑节点
  return breadcrumb;
  // transformMenuToBreadcrumb 函数结束
}

/**
 * Get breadcrumbs by route
 *
 * @param route
 * @param menus
 */
// 根据当前路由生成面包屑（中文说明：优先匹配 route.name，其次匹配 activeMenu，并处理多级路由）
export function getBreadcrumbsByRoute(
  route: RouteLocationNormalizedLoaded,
  menus: App.Global.Menu[]
): App.Global.Breadcrumb[] {
  // 当前路由 key（name）
  const key = route.name as string;
  // activeMenu（用于路由隐藏子菜单时指定激活菜单）
  const activeKey = route.meta?.activeMenu;

  // 遍历菜单树查找匹配项
  for (const menu of menus) {
    // 匹配当前路由 name
    if (menu.key === key) {
      // 命中则返回单层面包屑
      return [transformMenuToBreadcrumb(menu)];
      // if 分支结束
    }

    // 匹配 activeMenu
    if (menu.key === activeKey) {
      // 路由层级分隔符
      const ROUTE_DEGREE_SPLITTER = '_';

      // 计算父级 key（用于判断是否需要补充父级菜单）
      const parentKey = key.split(ROUTE_DEGREE_SPLITTER).slice(0, -1).join(ROUTE_DEGREE_SPLITTER);

      // 当前路由对应的菜单对象（用于生成面包屑末级）
      const breadcrumbMenu = getGlobalMenuByBaseRoute(route);
      // parentKey 与 activeKey 不一致时，说明 activeMenu 指向非父级，直接返回当前节点面包屑
      if (parentKey !== activeKey) {
        // 返回当前路由的面包屑
        return [transformMenuToBreadcrumb(breadcrumbMenu)];
        // if 分支结束
      }

      // 返回 activeMenu + 当前路由两级面包屑
      return [transformMenuToBreadcrumb(menu), transformMenuToBreadcrumb(breadcrumbMenu)];
      // if 分支结束
    }

    // 递归 children 菜单
    if (menu.children?.length) {
      // 递归获取子菜单面包屑
      const result = getBreadcrumbsByRoute(route, menu.children);
      // 子结果存在时补上当前 menu 作为父级面包屑
      if (result.length > 0) {
        // 返回父级 + 子结果
        return [transformMenuToBreadcrumb(menu), ...result];
        // if 分支结束
      }
      // children 分支结束
    }
    // for..of 单次迭代结束
  }

  // 未匹配到任何菜单时返回空数组
  return [];
  // getBreadcrumbsByRoute 函数结束
}

/**
 * Transform menu to searchMenus
 *
 * @param menus - menus
 * @param treeMap
 */
// 将树形菜单转换为搜索菜单列表（中文说明：提取所有叶子节点菜单）
export function transformMenuToSearchMenus(menus: App.Global.Menu[], treeMap: App.Global.Menu[] = []) {
  // menus 为空数组时返回空数组
  if (menus && menus.length === 0) return [];
  // reduce 遍历菜单树并填充 treeMap
  return menus.reduce((acc, cur) => {
    // 没有 children 视为叶子菜单，加入搜索列表
    if (!cur.children) {
      // 推入叶子菜单
      acc.push(cur);
      // if 分支结束
    }
    // 有 children 时递归处理
    if (cur.children && cur.children.length > 0) {
      // 递归展开子菜单
      transformMenuToSearchMenus(cur.children, treeMap);
      // if 分支结束
    }
    // 返回累加器
    return acc;
    // reduce 单次迭代结束
  }, treeMap);
  // transformMenuToSearchMenus 函数结束
}
