<script setup lang="tsx">
import { computed } from 'vue';
import { zhCN } from 'pro-naive-ui';
import { useAppStore } from '@/store/modules/app';

// 获取应用状态（用于读取当前语言）
const appStore = useAppStore();

// ProNaiveUI 的 locale 配置（中文说明：仅 zh-CN 时注入 zhCN，其它语言使用默认）
const locale = computed(() => {
  return appStore.locale === 'zh-CN' ? zhCN : undefined;
});
</script>

<template>
  <!-- ProConfigProvider：为 pro-naive-ui 注入 locale 等全局配置 -->
  <ProConfigProvider :locale="locale" class="h-full">
    <slot></slot>
  </ProConfigProvider>
</template>
