<script setup lang="ts">
import ThemeSchema from './modules/theme-schema.vue';
import ThemeColor from './modules/theme-color.vue';
import ThemeRadius from './modules/theme-radius.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'AppearanceSettings'
});
</script>

<template>
  <!-- 外观设置：主题模式/主题色/圆角等配置项 -->
  <div class="flex-col-stretch gap-16px">
    <ThemeSchema />
    <ThemeColor />
    <ThemeRadius />
  </div>
</template>

<style scoped></style>
