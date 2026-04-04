<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'FooterSettings'
});

// 获取主题状态（底部显隐/高度/固定/右侧等）
const themeStore = useThemeStore();

// 当前布局模式
const layoutMode = computed(() => themeStore.layout.mode);
// 是否为 wrapper 滚动模式（中文说明：wrapper 模式下才支持固定 footer）
const isWrapperScrollMode = computed(() => themeStore.layout.scrollMode === 'wrapper');
// 是否为顶部混合布局（中文说明：支持 footer 右对齐）
const isMixHorizontalMode = computed(() =>
  ['top-hybrid-sidebar-first', 'top-hybrid-header-first'].includes(layoutMode.value)
);
</script>

<template>
  <!-- 底部设置：显隐/固定/高度/右对齐等配置 -->
  <NDivider>{{ $t('theme.layout.footer.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- 底部显隐 -->
    <SettingItem key="1" :label="$t('theme.layout.footer.visible')">
      <NSwitch v-model:value="themeStore.footer.visible" />
    </SettingItem>
    <!-- 固定底部：仅 footer 可见且 wrapper 滚动模式时显示 -->
    <SettingItem
      v-if="themeStore.footer.visible && isWrapperScrollMode"
      key="2"
      :label="$t('theme.layout.footer.fixed')"
    >
      <NSwitch v-model:value="themeStore.footer.fixed" />
    </SettingItem>
    <!-- 底部高度 -->
    <SettingItem v-if="themeStore.footer.visible" key="3" :label="$t('theme.layout.footer.height')">
      <NInputNumber v-model:value="themeStore.footer.height" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- 底部右对齐：仅顶部混合布局显示 -->
    <SettingItem
      v-if="themeStore.footer.visible && isMixHorizontalMode"
      key="4"
      :label="$t('theme.layout.footer.right')"
    >
      <NSwitch v-model:value="themeStore.footer.right" />
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
