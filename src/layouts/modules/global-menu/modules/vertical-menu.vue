<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { SimpleScrollbar } from '@sa/materials';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu } from '../context';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'VerticalMenu'
});

// 当前路由（用于监听路由变化更新展开项）
const route = useRoute();
// 获取应用状态（侧边栏折叠等）
const appStore = useAppStore();
// 获取主题状态（侧边栏反转/暗黑模式等）
const themeStore = useThemeStore();
// 获取路由状态（菜单 options 与选中路径计算）
const routeStore = useRouteStore();
// 获取路由跳转方法（带 meta.query）
const { routerPushByKeyWithMetaQuery } = useRouterPush();
// 菜单上下文：当前选中 key
const { selectedKey } = useMenu();

// 菜单是否反色（中文说明：亮色模式且 sider.inverted=true 时反色）
const inverted = computed(() => !themeStore.darkMode && themeStore.sider.inverted);

// 展开菜单 key 列表
const expandedKeys = ref<string[]>([]);

// 更新展开项（中文说明：折叠状态或无选中项时清空，否则展开选中路径）
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
  <!-- 垂直菜单：挂载到侧边栏容器（Teleport） -->
  <Teleport :to="`#${GLOBAL_SIDER_MENU_ID}`">
    <SimpleScrollbar>
      <NMenu
        v-model:expanded-keys="expandedKeys"
        mode="vertical"
        :value="selectedKey"
        :collapsed="appStore.siderCollapse"
        :collapsed-width="themeStore.sider.collapsedWidth"
        :collapsed-icon-size="22"
        :options="routeStore.menus"
        :inverted="inverted"
        :indent="18"
        @update:value="routerPushByKeyWithMetaQuery"
      />
    </SimpleScrollbar>
  </Teleport>
</template>

<style scoped></style>
