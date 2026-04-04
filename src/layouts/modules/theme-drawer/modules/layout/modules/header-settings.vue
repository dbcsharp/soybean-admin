<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'HeaderSettings'
});

// 获取主题状态（头部高度/面包屑配置等）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 头部设置：高度/面包屑显隐/面包屑图标 -->
  <NDivider>{{ $t('theme.layout.header.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- 头部高度 -->
    <SettingItem key="1" :label="$t('theme.layout.header.height')">
      <NInputNumber v-model:value="themeStore.header.height" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- 面包屑显隐 -->
    <SettingItem key="2" :label="$t('theme.layout.header.breadcrumb.visible')">
      <NSwitch v-model:value="themeStore.header.breadcrumb.visible" />
    </SettingItem>
    <!-- 面包屑是否显示图标：仅面包屑可见时显示 -->
    <SettingItem
      v-if="themeStore.header.breadcrumb.visible"
      key="3"
      :label="$t('theme.layout.header.breadcrumb.showIcon')"
    >
      <NSwitch v-model:value="themeStore.header.breadcrumb.showIcon" />
    </SettingItem>
  </TransitionGroup>
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
