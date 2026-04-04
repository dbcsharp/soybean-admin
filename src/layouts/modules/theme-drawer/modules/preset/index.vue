<script setup lang="ts">
import ThemePreset from './modules/theme-preset.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'PresetSettings'
});
</script>

<template>
  <!-- 预设设置：主题预设列表与一键应用 -->
  <div class="flex-col-stretch gap-16px">
    <ThemePreset />
  </div>
</template>

<style scoped></style>
