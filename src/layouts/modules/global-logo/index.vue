<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalLogo'
});

// 组件 Props：控制是否显示标题文本
interface Props {
  /** Whether to show the title */
  showTitle?: boolean;
}

// 声明 props 并设置默认值
withDefaults(defineProps<Props>(), {
  showTitle: true
});
</script>

<template>
  <!-- 全局 Logo：点击跳转首页，包含系统 Logo 与可选标题 -->
  <RouterLink to="/" class="w-full flex-center nowrap-hidden">
    <SystemLogo class="size-32px" />
    <h2 v-show="showTitle" class="pl-8px text-16px text-primary font-bold transition duration-300 ease-in-out">
      {{ $t('system.title') }}
    </h2>
  </RouterLink>
</template>

<style scoped></style>
