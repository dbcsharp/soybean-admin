<script setup lang="ts">
import { computed } from 'vue';
import { themeSchemaRecord } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemeSchema'
});

// 获取主题状态（主题模式/暗黑/布局/侧边栏等）
const themeStore = useThemeStore();

// 主题模式对应的图标映射
const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

// 切换主题模式（light/dark/auto）
function handleSegmentChange(value: string | number) {
  themeStore.setThemeScheme(value as UnionKey.ThemeScheme);
}

// 灰色模式开关
function handleGrayscaleChange(value: boolean) {
  themeStore.setGrayscale(value);
}

// 色弱模式开关
function handleColourWeaknessChange(value: boolean) {
  themeStore.setColourWeakness(value);
}

// 是否显示“深色侧边栏”开关（仅亮色模式 + vertical 布局显示）
const showSiderInverted = computed(() => !themeStore.darkMode && themeStore.layout.mode.includes('vertical'));
</script>

<template>
  <!-- 主题模式配置：light/dark/auto + 灰色/色弱模式 -->
  <NDivider>{{ $t('theme.appearance.themeSchema.title') }}</NDivider>
  <div class="flex-col-stretch gap-16px">
    <!-- 主题模式选择：使用 tabs segment 展示图标 -->
    <div class="i-flex-center">
      <NTabs
        :key="themeStore.themeScheme"
        type="segment"
        size="small"
        class="relative w-214px"
        :value="themeStore.themeScheme"
        @update:value="handleSegmentChange"
      >
        <NTab v-for="(_, key) in themeSchemaRecord" :key="key" :name="key">
          <SvgIcon :icon="icons[key]" class="h-23px text-icon-small" />
        </NTab>
      </NTabs>
    </div>
    <!-- 深色侧边栏：仅在特定布局/亮色模式下显示 -->
    <Transition name="sider-inverted">
      <SettingItem v-if="showSiderInverted" :label="$t('theme.layout.sider.inverted')">
        <NSwitch v-model:value="themeStore.sider.inverted" />
      </SettingItem>
    </Transition>
    <!-- 灰色模式 -->
    <SettingItem :label="$t('theme.appearance.grayscale')">
      <NSwitch :value="themeStore.grayscale" @update:value="handleGrayscaleChange" />
    </SettingItem>
    <!-- 色弱模式 -->
    <SettingItem :label="$t('theme.appearance.colourWeakness')">
      <NSwitch :value="themeStore.colourWeakness" @update:value="handleColourWeaknessChange" />
    </SettingItem>
  </div>
</template>

<style scoped>
.sider-inverted-enter-active,
.sider-inverted-leave-active {
  --uno: h-22px transition-all-300;
}

.sider-inverted-enter-from,
.sider-inverted-leave-to {
  --uno: translate-x-20px opacity-0 h-0;
}
</style>
