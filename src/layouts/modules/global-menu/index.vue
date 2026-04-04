<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import VerticalMenu from './modules/vertical-menu.vue';
import VerticalMixMenu from './modules/vertical-mix-menu.vue';
import VerticalHybridHeaderFirst from './modules/vertical-hybrid-header-first.vue';
import HorizontalMenu from './modules/horizontal-menu.vue';
import TopHybridSidebarFirst from './modules/top-hybrid-sidebar-first.vue';
import TopHybridHeaderFirst from './modules/top-hybrid-header-first.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalMenu'
});

// 获取应用状态（移动端等）
const appStore = useAppStore();
// 获取主题状态（布局模式）
const themeStore = useThemeStore();

// 当前布局模式下应该渲染的菜单组件
const activeMenu = computed(() => {
  const menuMap: Record<UnionKey.ThemeLayoutMode, Component> = {
    vertical: VerticalMenu,
    'vertical-mix': VerticalMixMenu,
    'vertical-hybrid-header-first': VerticalHybridHeaderFirst,
    horizontal: HorizontalMenu,
    'top-hybrid-sidebar-first': TopHybridSidebarFirst,
    'top-hybrid-header-first': TopHybridHeaderFirst
  };

  return menuMap[themeStore.layout.mode];
});

// vertical + 移动端时强制重渲染（中文说明：避免移动端切换时菜单残留状态）
const reRenderVertical = computed(() => themeStore.layout.mode === 'vertical' && appStore.isMobile);
</script>

<template>
  <!-- 全局菜单：根据布局模式动态渲染对应菜单组件 -->
  <component :is="activeMenu" :key="reRenderVertical" />
</template>

<style scoped></style>
