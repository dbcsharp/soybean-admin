<script setup lang="ts">
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemeColor'
});

// 获取主题状态（主题色/推荐算法/信息色跟随主色等）
const themeStore = useThemeStore();

// 更新指定主题色（primary/info/success/warning/error）
function handleUpdateColor(color: string, key: App.Theme.ThemeColorKey) {
  themeStore.updateThemeColors(key, color);
}

// 预设色板（中文说明：ColorPicker 的可选色列表）
const swatches: string[] = [
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#a855f7',
  '#0ea5e9',
  '#06b6d4',
  '#f43f5e',
  '#ef4444',
  '#ec4899',
  '#d946ef',
  '#f97316',
  '#f59e0b',
  '#eab308',
  '#84cc16',
  '#22c55e',
  '#10b981'
];
</script>

<template>
  <!-- 主题颜色配置：推荐算法开关 + 各颜色取色器 -->
  <NDivider>{{ $t('theme.appearance.themeColor.title') }}</NDivider>
  <div class="flex-col-stretch gap-12px">
    <!-- 推荐算法开关（带 tooltip 说明与链接） -->
    <SettingItem key="recommend-color" :label="$t('theme.appearance.recommendColor')">
      <template #suffix>
        <IconTooltip>
          <p>
            <span class="pr-12px">{{ $t('theme.appearance.recommendColorDesc') }}</span>
            <br />
            <NButton
              text
              tag="a"
              href="https://uicolors.app/create"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray"
            >
              https://uicolors.app/create
            </NButton>
          </p>
        </IconTooltip>
      </template>
      <NSwitch v-model:value="themeStore.recommendColor" />
    </SettingItem>

    <!-- 主题色列表：primary/info/success/warning/error -->
    <SettingItem
      v-for="(_, key) in themeStore.themeColors"
      :key="key"
      :label="$t(`theme.appearance.themeColor.${key}`)"
    >
      <!-- info 色支持“跟随主色” -->
      <template v-if="key === 'info'" #suffix>
        <NCheckbox v-model:checked="themeStore.isInfoFollowPrimary">
          {{ $t('theme.appearance.themeColor.followPrimary') }}
        </NCheckbox>
      </template>
      <!-- 颜色选择器：info 且跟随主色时禁用 -->
      <NColorPicker
        class="w-90px"
        :value="themeStore.themeColors[key]"
        :disabled="key === 'info' && themeStore.isInfoFollowPrimary"
        :show-alpha="false"
        :swatches="swatches"
        @update:value="handleUpdateColor($event, key)"
      />
    </SettingItem>
  </div>
</template>

<style scoped></style>
