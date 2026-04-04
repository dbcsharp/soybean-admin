<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ReloadButton'
});

// 组件 Props：loading=true 时旋转图标
interface Props {
  loading?: boolean;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- 刷新按钮：支持 loading 动画 -->
  <ButtonIcon :tooltip-content="$t('icon.reload')">
    <icon-ant-design-reload-outlined :class="{ 'animate-spin animate-duration-750': loading }" />
  </ButtonIcon>
</template>

<style scoped></style>
