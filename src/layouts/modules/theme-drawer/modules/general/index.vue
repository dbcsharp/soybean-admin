<script setup lang="ts">
import GlobalSettings from './modules/global-settings.vue';
import WatermarkSettings from './modules/watermark-settings.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GeneralSettings'
});
</script>

<template>
  <!-- 通用设置：全局功能开关（多语言/全局搜索）与水印配置 -->
  <div class="flex-col-stretch gap-16px">
    <GlobalSettings />
    <WatermarkSettings />
  </div>
</template>

<style scoped></style>
