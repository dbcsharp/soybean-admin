import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useContext } from '@sa/hooks';
import type { RouteKey } from '@elegant-router/types';
import { useRouteStore } from '@/store/modules/route';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';

// 混合菜单上下文：为 mix/hybrid 等菜单模式提供一级/二级/子级菜单与激活状态管理
export const [provideMixMenuContext, useMixMenuContext] = useContext('MixMenu', useMixMenu);

// 创建混合菜单上下文的实现（统一管理各层级菜单、激活 key、自动选中最深菜单等）
function useMixMenu() {
  // 当前路由（用于监听变化并同步激活 key）
  const route = useRoute();
  // 路由 store（提供菜单树与选中路径计算）
  const routeStore = useRouteStore();
  // 主题 store（用于读取 autoSelectFirstMenu 等配置）
  const themeStore = useThemeStore();
  // 菜单选中 key（从 route.meta/route.name 计算）
  const { selectedKey } = useMenu();
  // 路由跳转工具（带 meta.query）
  const { routerPushByKeyWithMetaQuery } = useRouterPush();

  // 全量菜单树（一级菜单数组）
  const allMenus = computed<App.Global.Menu[]>(() => routeStore.menus);

  // 一级菜单列表（从 menus 中剥离 children，仅用于顶部/侧栏一级展示）
  const firstLevelMenus = computed<App.Global.Menu[]>(() =>
    routeStore.menus.map(menu => {
      const { children: _, ...rest } = menu;

      return rest;
    })
  );

  // 当前激活的一级菜单 key
  const activeFirstLevelMenuKey = ref('');

  // 设置激活一级菜单 key
  function setActiveFirstLevelMenuKey(key: string) {
    activeFirstLevelMenuKey.value = key;
  }

  // 从当前选中 key 推导激活一级菜单 key（routeName 以 '_' 分隔层级）
  function getActiveFirstLevelMenuKey() {
    const [firstLevelRouteName] = selectedKey.value.split('_');

    setActiveFirstLevelMenuKey(firstLevelRouteName);
  }

  // 当前激活一级菜单是否有子菜单
  const isActiveFirstLevelMenuHasChildren = computed(() => {
    if (!activeFirstLevelMenuKey.value) {
      return false;
    }

    const findItem = allMenus.value.find(item => item.key === activeFirstLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  // 选择一级菜单（如果没有子菜单则直接跳转，有子菜单则等待二级菜单选择）
  function handleSelectFirstLevelMenu(key: RouteKey) {
    setActiveFirstLevelMenuKey(key);

    if (!isActiveFirstLevelMenuHasChildren.value) {
      routerPushByKeyWithMetaQuery(key);
    }
  }

  // 二级菜单列表（当前激活一级菜单的 children）
  const secondLevelMenus = computed<App.Global.Menu[]>(
    () => allMenus.value.find(menu => menu.key === activeFirstLevelMenuKey.value)?.children || []
  );

  // 当前激活的二级菜单 key
  const activeSecondLevelMenuKey = ref('');

  // 设置激活二级菜单 key
  function setActiveSecondLevelMenuKey(key: string) {
    activeSecondLevelMenuKey.value = key;
  }

  // 从当前选中 key 推导激活二级菜单 key（拼接 firstLevel + '_' + level2Suffix）
  function getActiveSecondLevelMenuKey() {
    const keys = selectedKey.value.split('_');

    if (keys.length < 2) {
      setActiveSecondLevelMenuKey('');
      return;
    }

    const [firstLevelRouteName, level2SuffixName] = keys;

    const secondLevelRouteName = `${firstLevelRouteName}_${level2SuffixName}`;

    setActiveSecondLevelMenuKey(secondLevelRouteName);
  }

  // 当前激活二级菜单是否有子菜单
  const isActiveSecondLevelMenuHasChildren = computed(() => {
    if (!activeSecondLevelMenuKey.value) {
      return false;
    }

    const findItem = secondLevelMenus.value.find(item => item.key === activeSecondLevelMenuKey.value);

    return Boolean(findItem?.children?.length);
  });

  // 选择二级菜单（如果没有子菜单则直接跳转，有子菜单则等待子级菜单选择）
  function handleSelectSecondLevelMenu(key: RouteKey) {
    setActiveSecondLevelMenuKey(key);

    if (!isActiveSecondLevelMenuHasChildren.value) {
      routerPushByKeyWithMetaQuery(key);
    }
  }

  // 子级菜单列表（当前激活二级菜单的 children）
  const childLevelMenus = computed<App.Global.Menu[]>(
    () => secondLevelMenus.value.find(menu => menu.key === activeSecondLevelMenuKey.value)?.children || []
  );

  // 是否存在子级菜单
  const hasChildLevelMenus = computed(() => childLevelMenus.value.length > 0);

  // 获取“最深层”的菜单 key（用于 autoSelectFirstMenu=true 时自动跳转）
  function getDeepestLevelMenuKey(): RouteKey | null {
    if (!secondLevelMenus.value.length || !themeStore.sider.autoSelectFirstMenu) {
      return null;
    }

    const secondLevelFirstMenu = secondLevelMenus.value[0];

    if (!secondLevelFirstMenu) {
      return null;
    }

    // 递归找到最深层叶子节点
    function findDeepest(menu: App.Global.Menu): RouteKey {
      if (!menu.children?.length) {
        return menu.routeKey;
      }

      return findDeepest(menu.children[0]);
    }

    return findDeepest(secondLevelFirstMenu);
  }

  // 激活并跳转到最深层菜单
  function activeDeepestLevelMenuKey() {
    const deepestLevelMenuKey = getDeepestLevelMenuKey();
    if (!deepestLevelMenuKey) return;

    // select the deepest second level menu
    handleSelectSecondLevelMenu(deepestLevelMenuKey);
  }

  // 监听路由变化：同步激活 key（一级/二级）
  watch(
    () => route.name,
    () => {
      getActiveFirstLevelMenuKey();
      // if there are child level menus, get the active second level menu key
      if (hasChildLevelMenus.value) {
        getActiveSecondLevelMenuKey();
      }
    },
    { immediate: true }
  );

  // 对外暴露上下文状态与操作方法
  return {
    firstLevelMenus,
    activeFirstLevelMenuKey,
    setActiveFirstLevelMenuKey,
    isActiveFirstLevelMenuHasChildren,
    handleSelectFirstLevelMenu,
    getActiveFirstLevelMenuKey,
    secondLevelMenus,
    activeSecondLevelMenuKey,
    setActiveSecondLevelMenuKey,
    isActiveSecondLevelMenuHasChildren,
    handleSelectSecondLevelMenu,
    getActiveSecondLevelMenuKey,
    childLevelMenus,
    hasChildLevelMenus,
    getDeepestLevelMenuKey,
    activeDeepestLevelMenuKey
  };
}

// 菜单选中状态 Hook（基于 route.name 与 meta.hideInMenu/activeMenu 计算当前选中 key）
export function useMenu() {
  // 当前路由
  const route = useRoute();

  // 当前选中 key（用于 NMenu value）
  const selectedKey = computed(() => {
    const { hideInMenu, activeMenu } = route.meta;
    const name = route.name as string;

    const routeName = (hideInMenu ? activeMenu : name) || name;

    return routeName;
  });

  // 对外返回选中 key
  return {
    selectedKey
  };
}
