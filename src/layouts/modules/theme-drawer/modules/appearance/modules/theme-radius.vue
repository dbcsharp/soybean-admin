<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemeRadius'
});

// 获取主题状态（圆角配置）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 圆角配置：通过 InputNumber 设置主题圆角半径 -->
  <NDivider>{{ $t('theme.appearance.themeRadius.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <SettingItem key="1" :label="$t('theme.appearance.themeRadius.title')">
      <NInputNumber v-model:value="themeStore.themeRadius" size="small" :step="1" :min="0" :max="16" class="w-120px" />
    </SettingItem>
  </TransitionGroup>
</template>

<style scoped></style>
