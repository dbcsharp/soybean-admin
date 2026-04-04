<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import LayoutModeCard from '../../../components/layout-mode-card.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LayoutMode'
});

// 获取应用状态（用于移动端禁用布局切换）
const appStore = useAppStore();
// 获取主题状态（用于读写 layout.mode）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 布局模式选择：通过 LayoutModeCard 切换六种布局模式 -->
  <NDivider>{{ $t('theme.layout.layoutMode.title') }}</NDivider>
  <LayoutModeCard v-model:mode="themeStore.layout.mode" :disabled="appStore.isMobile">
    <template #vertical>
      <div class="layout-sider h-full w-18px !bg-primary"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary-200"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #vertical-mix>
      <div class="layout-sider h-full w-8px !bg-primary"></div>
      <div class="layout-sider h-full w-16px !bg-primary-300"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary-200"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #vertical-hybrid-header-first>
      <div class="layout-sider h-full w-8px !bg-primary"></div>
      <div class="layout-sider h-full w-16px !bg-primary-300"></div>
      <div class="vertical-wrapper">
        <div class="layout-header bg-primary"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #horizontal>
      <div class="layout-header !bg-primary"></div>
      <div class="horizontal-wrapper">
        <div class="layout-main"></div>
      </div>
    </template>
    <template #top-hybrid-sidebar-first>
      <div class="layout-header !bg-primary-300"></div>
      <div class="horizontal-wrapper">
        <div class="layout-sider w-18px !bg-primary"></div>
        <div class="layout-main"></div>
      </div>
    </template>
    <template #top-hybrid-header-first>
      <div class="layout-header bg-primary"></div>
      <div class="horizontal-wrapper">
        <div class="layout-sider w-18px"></div>
        <div class="layout-main"></div>
      </div>
    </template>
  </LayoutModeCard>
</template>

<style scoped>
.layout-header {
  --uno: h-16px rd-4px;
}

.layout-sider {
  --uno: bg-primary-300 rd-4px;
}

.layout-main {
  --uno: flex-1 bg-primary-200 rd-4px;
}

.vertical-wrapper {
  --uno: flex-1 flex-col gap-6px;
}

.horizontal-wrapper {
  --uno: flex-1 flex gap-6px;
}
</style>
