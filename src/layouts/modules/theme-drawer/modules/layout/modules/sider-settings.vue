<script setup lang="ts">
import { computed } from 'vue';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'SiderSettings'
});

// 获取主题状态（侧边栏宽度/混合模式宽度等）
const themeStore = useThemeStore();

// 当前布局模式
const layoutMode = computed(() => themeStore.layout.mode);
// 是否为混合布局（mix/hybrid）
const isMixLayoutMode = computed(() => layoutMode.value.includes('mix') || layoutMode.value.includes('hybrid'));
// 是否为 hybrid 布局
const isHybridLayoutMode = computed(() => layoutMode.value.includes('hybrid'));
</script>

<template>
  <!-- 侧边栏设置：不同布局模式下展示不同宽度/自动选中配置 -->
  <NDivider>{{ $t('theme.layout.sider.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- vertical：侧边栏宽度 -->
    <SettingItem v-if="layoutMode === 'vertical'" key="1" :label="$t('theme.layout.sider.width')">
      <NInputNumber v-model:value="themeStore.sider.width" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- vertical：折叠宽度 -->
    <SettingItem v-if="layoutMode === 'vertical'" key="2" :label="$t('theme.layout.sider.collapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.collapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- mix/hybrid：mixWidth -->
    <SettingItem v-if="isMixLayoutMode" key="3" :label="$t('theme.layout.sider.mixWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- mix/hybrid：mixCollapsedWidth -->
    <SettingItem v-if="isMixLayoutMode" key="4" :label="$t('theme.layout.sider.mixCollapsedWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixCollapsedWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- vertical-mix：子菜单宽度 -->
    <SettingItem v-if="layoutMode === 'vertical-mix'" key="5" :label="$t('theme.layout.sider.mixChildMenuWidth')">
      <NInputNumber v-model:value="themeStore.sider.mixChildMenuWidth" size="small" :step="1" class="w-120px" />
    </SettingItem>
    <!-- hybrid：自动选中第一个菜单 -->
    <SettingItem v-if="isHybridLayoutMode" key="6" :label="$t('theme.layout.sider.autoSelectFirstMenu')">
      <template #suffix>
        <IconTooltip :desc="$t('theme.layout.sider.autoSelectFirstMenuTip')" />
      </template>
      <NSwitch v-model:value="themeStore.sider.autoSelectFirstMenu" />
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
