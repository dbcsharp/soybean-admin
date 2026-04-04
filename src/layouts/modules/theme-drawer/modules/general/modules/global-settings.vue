<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalSettings'
});

// 获取主题状态（头部多语言/全局搜索开关）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 全局功能设置：多语言与全局搜索 -->
  <NDivider>{{ $t('theme.general.title') }}</NDivider>
  <!-- 多语言切换开关 -->
  <SettingItem :label="$t('theme.general.multilingual.visible')">
    <NSwitch v-model:value="themeStore.header.multilingual.visible" />
  </SettingItem>

  <!-- 全局搜索开关 -->
  <SettingItem :label="$t('theme.general.globalSearch.visible')">
    <NSwitch v-model:value="themeStore.header.globalSearch.visible" />
  </SettingItem>
</template>

<style scoped>
.setting-list-move,
.setting-list-enter-active,
.setting-list-leave-active {
  --uno: transition-all-300;
}

.setting-list-enter-from,
.setting-list-leave-to {
  --uno: opacity-0 -translate-x-30px;
}

.setting-list-leave-active {
  --uno: absolute;
}
</style>
