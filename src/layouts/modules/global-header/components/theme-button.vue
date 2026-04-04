<script setup lang="ts">
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemeButton'
});

// 获取应用状态（用于打开主题配置抽屉）
const appStore = useAppStore();
</script>

<template>
  <!-- 主题配置按钮：打开 ThemeDrawer -->
  <ButtonIcon
    icon="majesticons:color-swatch-line"
    :tooltip-content="$t('icon.themeConfig')"
    @click="appStore.openThemeDrawer"
  />
</template>

<style scoped></style>
