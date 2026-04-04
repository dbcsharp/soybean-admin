<script setup lang="ts">
import { computed } from 'vue';
import { themePageAnimationModeOptions, themeScrollModeOptions } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ContentSettings'
});

// 获取主题状态（滚动模式/页面切换动画/固定头部与标签栏等）
const themeStore = useThemeStore();

// 是否为 wrapper 滚动模式（中文说明：wrapper 模式下才支持固定 header+tab）
const isWrapperScrollMode = computed(() => themeStore.layout.scrollMode === 'wrapper');
</script>

<template>
  <!-- 内容区设置：滚动模式/页面动画/动画模式/固定头部与标签栏 -->
  <NDivider>{{ $t('theme.layout.content.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- 滚动模式 -->
    <SettingItem key="1" :label="$t('theme.layout.content.scrollMode.title')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.content.scrollMode.tip')" />
      </template>
      <NSelect
        v-model:value="themeStore.layout.scrollMode"
        :options="translateOptions(themeScrollModeOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <!-- 页面切换动画开关 -->
    <SettingItem key="2" :label="$t('theme.layout.content.page.animate')">
      <NSwitch v-model:value="themeStore.page.animate" />
    </SettingItem>
    <!-- 动画模式：仅动画开启时显示 -->
    <SettingItem v-if="themeStore.page.animate" key="3" :label="$t('theme.layout.content.page.mode.title')">
      <NSelect
        v-model:value="themeStore.page.animateMode"
        :options="translateOptions(themePageAnimationModeOptions)"
        size="small"
        class="w-120px"
      />
    </SettingItem>
    <!-- 固定 Header 与 Tab：仅 wrapper 滚动模式显示 -->
    <SettingItem v-if="isWrapperScrollMode" key="4" :label="$t('theme.layout.content.fixedHeaderAndTab')">
      <NSwitch v-model:value="themeStore.fixedHeaderAndTab" />
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
