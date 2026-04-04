<script setup lang="ts">
import type { RouteKey } from '@elegant-router/types';
import { GLOBAL_HEADER_MENU_ID, GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouterPush } from '@/hooks/common/router';
import FirstLevelMenu from '../components/first-level-menu.vue';
import { useMenu, useMixMenuContext } from '../context';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'TopHybridSidebarFirst'
});

// 获取应用状态（侧边栏折叠等）
const appStore = useAppStore();
// 获取主题状态（暗黑模式/主题色等）
const themeStore = useThemeStore();
// 获取路由跳转方法（带 meta.query）
const { routerPushByKeyWithMetaQuery } = useRouterPush();
// 混合菜单上下文：一级/二级菜单与激活 key 等
const {
  firstLevelMenus,
  secondLevelMenus,
  activeFirstLevelMenuKey,
  handleSelectFirstLevelMenu,
  activeDeepestLevelMenuKey
} = useMixMenuContext('TopHybridSidebarFirst');
// 菜单上下文：当前选中 key
const { selectedKey } = useMenu();

/**
 * Handle first level menu select
 * @param key RouteKey
 */
// 选择一级菜单（侧边栏）：同步激活并默认选中最深菜单
function handleSelectMenu(key: RouteKey) {
  handleSelectFirstLevelMenu(key);

  // if there are second level menus, select the deepest one by default
  activeDeepestLevelMenuKey();
}
</script>

<template>
  <!-- 顶部混合-侧边优先：顶部横向展示二级菜单，侧边栏展示一级菜单 -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <!-- 顶部二级菜单 -->
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="secondLevelMenus"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <div class="h-full pt-2">
      <!-- 侧边栏一级菜单：缩略图标列表 -->
      <FirstLevelMenu
        :menus="firstLevelMenus"
        :active-menu-key="activeFirstLevelMenuKey"
        :sider-collapse="appStore.siderCollapse"
        :dark-mode="themeStore.darkMode"
        :theme-color="themeStore.themeColor"
        @select="handleSelectMenu"
        @toggle-sider-collapse="appStore.toggleSiderCollapse"
      />
    </div>
  </Teleport>
</template>

<style scoped></style>
