<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu, useMixMenuContext } from '../context';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'TopHybridHeaderFirst'
});

// 当前路由（用于监听路由变化更新展开项）
const route = useRoute();
// 获取应用状态（侧边栏折叠等）
const appStore = useAppStore();
// 获取主题状态（侧边栏宽度等）
const themeStore = useThemeStore();
// 获取路由状态（选中路径计算）
const routeStore = useRouteStore();
// 获取路由跳转方法（带 meta.query）
const { routerPushByKeyWithMetaQuery } = useRouterPush();
// 混合菜单上下文：一级/二级菜单与激活 key 等
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridHeaderFirst');
// 菜单上下文：当前选中 key
const { selectedKey } = useMenu();

// 展开菜单 key 列表（用于侧边 NMenu）
const expandedKeys = ref<string[]>([]);

/**
 * Handle first level menu select
 * @param key RouteKey
 */
// 选择一级菜单（顶部）：同步激活并默认选中最深菜单
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  // if there are second level menus, select the deepest one by default
  activeDeepestLevelMenuKey();
}

// 更新展开项（折叠状态或无选中项时清空，否则展开选中路径）
function updateExpandedKeys() {
  if (appStore.siderCollapse || !selectedKey.value) {
    expandedKeys.value = [];
    return;
  }
  expandedKeys.value = routeStore.getSelectedMenuKeyPath(selectedKey.value);
}

// 监听路由 name 变化：同步展开项
watch(
  () => route.name,
  () => {
    updateExpandedKeys();
  },
  { immediate: true }
);
</script>

<template>
  <!-- 顶部混合-顶部优先：顶部横向展示一级菜单，侧边栏展示二级菜单 -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <!-- 顶部一级菜单 -->
    <NMenu
      mode="horizontal"
      :value="activeFirstLevelMenuKey"
      :options="firstLevelMenus"
      :indent="18"
      responsive
      @update:value="handleSelectMenu"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <!-- 侧边二级菜单：支持滚动与展开项 -->
    <SimpleScrollbar>
      <NMenu
        v-model:expanded-keys="expandedKeys"
        mode="vertical"
        :value="selectedKey"
        :collapsed="appStore.siderCollapse"
        :collapsed-width="themeStore.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="secondLevelMenus"
        :indent="18"
        @update:value="routerPushByKeyWithMetaQuery"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
