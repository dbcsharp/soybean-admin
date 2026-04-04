<script setup lang="ts">
// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'SettingItem'
});

// 组件 Props：设置项左侧 label 文案
interface Props {
  /** Label */
  label: string;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- 设置项容器：左侧 label + suffix 插槽，右侧默认插槽放置控件 -->
  <div class="w-full flex-y-center justify-between">
    <div class="flex-y-center">
      <span class="pr-8px text-base-text">{{ label }}</span>
      <slot name="suffix"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<style scoped></style>
