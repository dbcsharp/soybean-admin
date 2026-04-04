<script setup lang="ts">
import { computed } from 'vue';
import { GLOBAL_SIDER_MENU_ID } from '@/constants/app';
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import GlobalLogo from '../global-logo/index.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalSider'
});

// 获取应用状态（侧边栏折叠等）
const appStore = useAppStore();
// 获取主题状态（布局模式/侧边栏主题/暗黑模式等）
const themeStore = useThemeStore();

// 是否为“顶部混合-侧边优先”布局
const isTopHybridSidebarFirst = computed(() => themeStore.layout.mode === 'top-hybrid-sidebar-first');
// 是否为“顶部混合-顶部优先”布局
const isTopHybridHeaderFirst = computed(() => themeStore.layout.mode === 'top-hybrid-header-first');
// 是否使用深色菜单（非暗黑模式下，且非顶部混合布局，且 sider.inverted=true）
const darkMenu = computed(
  () =>
    !themeStore.darkMode && !isTopHybridSidebarFirst.value && !isTopHybridHeaderFirst.value && themeStore.sider.inverted
);
// 是否显示侧边栏 Logo（仅 vertical 模式显示）
const showLogo = computed(() => themeStore.layout.mode === 'vertical');
// 菜单容器 wrapper class（有 Logo 时占满剩余空间，否则高度 100%）
const menuWrapperClass = computed(() => (showLogo.value ? 'flex-1-hidden' : 'h-full'));
</script>

<template>
  <!-- 全局侧边栏：Logo（可选）+ 菜单挂载容器 -->
  <DarkModeContainer class="size-full flex-col-stretch shadow-sider" :inverted="darkMenu">
    <!-- 侧边栏 Logo：折叠时隐藏标题 -->
    <GlobalLogo
      v-if="showLogo"
      :show-title="!appStore.siderCollapse"
      :style="{ height: themeStore.header.height + 'px' }"
    />
    <!-- 侧边菜单占位容器：菜单组件会挂载到该节点 -->
    <div :id="GLOBAL_SIDER_MENU_ID" :class="menuWrapperClass"></div>
  </DarkModeContainer>
</template>

<style scoped></style>
