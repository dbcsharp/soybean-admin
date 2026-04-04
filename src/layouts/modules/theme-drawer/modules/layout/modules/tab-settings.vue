<script setup lang="ts">
import { themeTabModeOptions } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'TabSettings'
});

// 获取主题状态（标签栏显隐/高度/模式/中键关闭等）
const themeStore = useThemeStore();
</script>

<template>
  <!-- 标签栏设置：显隐/缓存/高度/模式/中键关闭 -->
  <NDivider>{{ $t('theme.layout.tab.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- 标签栏显隐 -->
    <SettingItem key="1" :label="$t('theme.layout.tab.visible')">
      <NSwitch v-model:value="themeStore.tab.visible" />
    </SettingItem>
    <!-- 标签页缓存：仅标签栏可见时显示 -->
    <SettingItem v-if="themeStore.tab.visible" key="2" :label="$t('theme.layout.tab.cache')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.tab.cacheTip')" />
      </template>
      <NSwitch v-model:value="themeStore.tab.cache" />
    </SettingItem>
    <!-- 标签栏高度 -->
    <SettingItem v-if="themeStore.tab.visible" key="3" :label="$t('theme.layout.tab.height')">
      <NInputNumber v-model:value="themeStore.tab.height" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- 标签样式模式 -->
    <SettingItem v-if="themeStore.tab.visible" key="4" :label="$t('theme.layout.tab.mode.title')">
      <NSelect
        v-model:value="themeStore.tab.mode"
        :options="translateOptions(themeTabModeOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <!-- 中键关闭标签页 -->
    <SettingItem v-if="themeStore.tab.visible" key="5" :label="$t('theme.layout.tab.closeByMiddleClick')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.tab.closeByMiddleClickTip')" />
      </template>
      <NSwitch v-model:value="themeStore.tab.closeTabByMiddleClick" />
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
