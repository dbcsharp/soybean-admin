<script setup lang="ts">
import { computed, ref } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import AppearanceSettings from './modules/appearance/index.vue';
import LayoutSettings from './modules/layout/index.vue';
import GeneralSettings from './modules/general/index.vue';
import ConfigOperation from './modules/config-operation.vue';
import PresetSettings from './modules/preset/index.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemeDrawer'
});

// 获取应用状态（用于控制抽屉显隐与移动端宽度）
const appStore = useAppStore();
// 当前激活的 Tab key
const activeTab = ref('appearance');

// 抽屉宽度（移动端使用 90vw，最大不超过 400px）
const drawerWidth = computed(() => {
  const width = 400;

  // On mobile devices, use 90% of viewport width with a maximum of 400px
  if (appStore.isMobile) {
    return `min(90vw, ${width}px)`;
  }

  return width;
});
</script>

<template>
  <!-- 主题配置抽屉：外观/布局/通用/预设四个 Tab，并在底部提供复制/重置配置 -->
  <NDrawer v-model:show="appStore.themeDrawerVisible" display-directive="show" :width="drawerWidth">
    <NDrawerContent :title="$t('theme.themeDrawerTitle')" :native-scrollbar="false" closable>
      <!-- Tab 切换：segment 风格 -->
      <NTabs v-model:value="activeTab" type="segment" size="medium" class="mb-16px">
        <NTab name="appearance" :tab="$t('theme.tabs.appearance')"></NTab>
        <NTab name="layout" :tab="$t('theme.tabs.layout')"></NTab>
        <NTab name="general" :tab="$t('theme.tabs.general')"></NTab>
        <NTab name="preset" :tab="$t('theme.tabs.preset')"></NTab>
      </NTabs>

      <!-- 内容区：KeepAlive 缓存各 Tab 组件状态 -->
      <div class="min-h-400px">
        <KeepAlive>
          <AppearanceSettings v-if="activeTab === 'appearance'" />
          <LayoutSettings v-else-if="activeTab === 'layout'" />
          <GeneralSettings v-else-if="activeTab === 'general'" />
          <PresetSettings v-else-if="activeTab === 'preset'" />
        </KeepAlive>
      </div>

      <template #footer>
        <!-- 底部操作：复制配置/重置配置 -->
        <ConfigOperation />
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style scoped>
:deep(.n-tab) {
  display: flex;
  align-items: center;
  gap: 8px;
}

:deep(.n-tab-pane) {
  padding: 0;
}
</style>
