<script setup lang="ts">
import { GLOBAL_HEADER_MENU_ID } from '@/constants/app';
import { useRouteStore } from '@/store/modules/route';
import { useRouterPush } from '@/hooks/common/router';
import { useMenu } from '../context';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'HorizontalMenu'
});

// 获取路由状态（菜单 options）
const routeStore = useRouteStore();
// 获取路由跳转方法（带 meta.query）
const { routerPushByKeyWithMetaQuery } = useRouterPush();
// 菜单上下文：当前选中 key
const { selectedKey } = useMenu();
</script>

<template>
  <!-- 横向菜单：挂载到顶部菜单容器（Teleport） -->
  <Teleport :to="`#${GLOBAL_HEADER_MENU_ID}`">
    <NMenu
      mode="horizontal"
      :value="selectedKey"
      :options="routeStore.menus"
      :indent="18"
      responsive
      @update:value="routerPushByKeyWithMetaQuery"
    />
  </Teleport>
</template>

<style scoped></style>
