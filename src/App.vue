<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, darkTheme } from 'naive-ui';
import type { WatermarkProps } from 'naive-ui';
import { useAppStore } from './store/modules/app';
import { useThemeStore } from './store/modules/theme';
import { naiveDateLocales, naiveLocales } from './locales/naive';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'App'
});

// 获取应用状态（语言等）
const appStore = useAppStore();
// 获取主题状态（暗黑模式/NaiveUI 主题覆盖/水印等）
const themeStore = useThemeStore();

// Naive UI 主题：暗黑模式时启用 darkTheme
const naiveDarkTheme = computed(() => (themeStore.darkMode ? darkTheme : undefined));

// Naive UI locale：根据 appStore.locale 选择对应语言包
const naiveLocale = computed(() => {
  return naiveLocales[appStore.locale];
});

// Naive UI date-locale：根据 appStore.locale 选择对应日期语言包
const naiveDateLocale = computed(() => {
  return naiveDateLocales[appStore.locale];
});

// 水印配置（内容来自 themeStore.watermarkContent，其他参数为展示样式）
const watermarkProps = computed<WatermarkProps>(() => {
  return {
    content: themeStore.watermarkContent,
    cross: true,
    fullscreen: true,
    fontSize: 16,
    lineHeight: 16,
    width: 384,
    height: 384,
    xOffset: 12,
    yOffset: 60,
    rotate: -15,
    zIndex: 9999
  };
});
</script>

<template>
  <!-- Naive UI 全局配置：主题/覆盖/多语言/日期多语言 -->
  <NConfigProvider
    :theme="naiveDarkTheme"
    :theme-overrides="themeStore.naiveTheme"
    :locale="naiveLocale"
    :date-locale="naiveDateLocale"
    class="h-full"
  >
    <!-- AppProvider：注册 window.$message/$dialog/$loadingBar/$notification -->
    <AppProvider>
      <!-- 路由出口：渲染布局与页面 -->
      <RouterView class="bg-layout" />
      <!-- 全局水印：按配置决定是否显示 -->
      <NWatermark v-if="themeStore.watermark.visible" v-bind="watermarkProps" />
    </AppProvider>
  </NConfigProvider>
</template>

<style scoped></style>
