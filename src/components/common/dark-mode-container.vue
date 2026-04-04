<script setup lang="ts">
// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'DarkModeContainer' });

// 组件 Props：inverted=true 时使用反色背景（用于深色菜单等）
interface Props {
  inverted?: boolean;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- 暗黑模式容器：统一背景/文字颜色，并支持 inverted 反色 -->
  <div class="bg-container text-base-text transition-300" :class="{ 'bg-inverted text-#1f1f1f': inverted }">
    <slot></slot>
  </div>
</template>

<style scoped></style>
