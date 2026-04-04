<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'FullScreen'
});

// 组件 Props：当前是否全屏（用于切换图标与 tooltip）
interface Props {
  full?: boolean;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- 全屏按钮：根据 full 切换图标与 tooltip -->
  <ButtonIcon :key="String(full)" :tooltip-content="full ? $t('icon.fullscreenExit') : $t('icon.fullscreen')">
    <icon-gridicons-fullscreen-exit v-if="full" />
    <icon-gridicons-fullscreen v-else />
  </ButtonIcon>
</template>

<style scoped></style>
