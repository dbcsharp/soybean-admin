<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import LayoutMode from './modules/layout-mode.vue';
import TabSettings from './modules/tab-settings.vue';
import HeaderSettings from './modules/header-settings.vue';
import SiderSettings from './modules/sider-settings.vue';
import FooterSettings from './modules/footer-settings.vue';
import ContentSettings from './modules/content-settings.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LayoutSettings'
});

// 获取主题状态（用于根据布局模式决定是否显示侧边栏设置）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 布局设置：布局模式/标签栏/头部/侧边栏/底部/内容区等配置项 -->
  <div class="flex-col-stretch gap-16px">
    <LayoutMode />
    <TabSettings />
    <HeaderSettings />
    <!-- The top menu mode does not have a sidebar -->
    <!-- 顶部菜单模式没有侧边栏：horizontal 模式下隐藏侧边栏设置 -->
    <SiderSettings v-if="themeStore.layout.mode !== 'horizontal'" />
    <FooterSettings />
    <ContentSettings />
  </div>
</template>

<style scoped></style>
