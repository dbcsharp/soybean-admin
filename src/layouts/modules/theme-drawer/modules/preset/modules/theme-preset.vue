<script setup lang="ts">
import { computed } from 'vue';
import { defu } from 'defu';
import { useThemeStore } from '@/store/modules/theme';
import { themeSettings } from '@/theme/settings';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ThemePreset'
});

// 主题预设结构（从 ThemeSetting 中挑选可配置项，并追加 name/desc/version 等元信息）
type ThemePreset = Pick<
  App.Theme.ThemeSetting,
  | 'themeScheme'
  | 'grayscale'
  | 'colourWeakness'
  | 'recommendColor'
  | 'themeColor'
  | 'themeRadius'
  | 'otherColor'
  | 'isInfoFollowPrimary'
  | 'layout'
  | 'page'
  | 'header'
  | 'tab'
  | 'fixedHeaderAndTab'
  | 'sider'
  | 'footer'
  | 'watermark'
  | 'tokens'
> & {
  name: string;
  desc: string;
  i18nkey?: string;
  version: string;
  /** Optional NaiveUI theme overrides */
  naiveui?: App.Theme.NaiveUIThemeOverride;
};

// 动态加载预设 JSON（eager：构建时直接打包进来）
const presetModules = import.meta.glob('@/theme/preset/*.json', { eager: true, import: 'default' });

// 获取主题状态（用于写入预设配置）
const themeStore = useThemeStore();

// Extract preset data
// 提取预设列表（根据文件名生成 id，并按 name 排序，default 置顶）
const presets = computed(() =>
  Object.entries(presetModules)
    .map(([path, presetData]) => {
      const fileName = path.split('/').pop()?.replace('.json', '') || '';
      return {
        id: fileName,
        ...(presetData as ThemePreset)
      };
    })
    .sort((a, b) => {
      if (a.name === 'default') return -1;
      if (b.name === 'default') return 1;
      return a.name.localeCompare(b.name);
    })
);

// 获取预设显示名称（优先使用 i18nkey 翻译，否则回退到 preset.name）
const getPresetName = (preset: ThemePreset): string => {
  if (!preset.i18nkey) return preset.name;
  try {
    const key = `${preset.i18nkey}.name` as App.I18n.I18nKey;
    const translated = $t(key);
    return translated !== key ? translated : preset.name;
  } catch {
    return preset.name;
  }
};

// 获取预设描述（优先使用 i18nkey 翻译，否则回退到 preset.desc）
const getPresetDesc = (preset: ThemePreset): string => {
  if (!preset.i18nkey) return preset.desc;
  try {
    const key = `${preset.i18nkey}.desc` as App.I18n.I18nKey;
    const translated = $t(key);
    return translated !== key ? translated : preset.desc;
  } catch {
    return preset.desc;
  }
};

// 应用预设（与默认 themeSettings 合并，再写入 themeStore，并同步 NaiveUI 覆盖配置）
const applyPreset = (preset: ThemePreset): void => {
  // 先与默认设置做深合并，补齐缺省字段
  const mergedPreset = defu(preset, themeSettings);
  const { themeScheme, grayscale, colourWeakness, layout, watermark, naiveui, ...rest } = mergedPreset;
  // 设置主题模式/灰色/色弱
  themeStore.setThemeScheme(themeScheme);
  themeStore.setGrayscale(grayscale);
  themeStore.setColourWeakness(colourWeakness);
  // 设置布局模式
  themeStore.setThemeLayout(layout.mode);
  // 设置水印开关（用户名/时间）
  themeStore.setWatermarkEnableUserName(watermark.enableUserName);
  themeStore.setWatermarkEnableTime(watermark.enableTime);

  // 批量写入其它配置（layout.scrollMode 需要合并到现有 layout）
  Object.assign(themeStore, {
    ...rest,
    layout: { ...themeStore.layout, scrollMode: layout.scrollMode },
    page: { ...rest.page },
    header: { ...rest.header },
    tab: { ...rest.tab },
    sider: { ...rest.sider },
    footer: { ...rest.footer },
    watermark: { ...watermark },
    tokens: { ...rest.tokens }
  });

  // Apply NaiveUI theme overrides if present
  // 设置 NaiveUI 主题覆盖（可选）
  themeStore.setNaiveThemeOverrides(naiveui);

  // 提示应用成功
  window.$message?.success($t('theme.appearance.preset.applySuccess'));
};
</script>

<template>
  <!-- 主题预设：展示预设卡片列表，并支持一键应用 -->
  <NDivider>{{ $t('theme.appearance.preset.title') }}</NDivider>

  <div class="flex flex-col gap-3">
    <div
      v-for="preset in presets"
      :key="preset.id"
      class="border border-primary/10 rounded-lg border-solid bg-white/5 p-3 backdrop-blur-10 transition-all duration-300 hover:(shadow-md -translate-y-0.5)"
    >
      <div class="mb-2 flex items-center justify-between">
        <div class="min-w-0 w-full flex flex-1 items-center justify-between gap-2">
          <h5 class="m-0 truncate text-sm text-primary font-600">
            {{ getPresetName(preset) }}
          </h5>
          <NBadge :value="`v${preset.version}`" type="info" size="small" class="flex-shrink-0 opacity-80" />
        </div>
        <!-- 应用预设按钮 -->
        <NButton type="primary" size="tiny" ghost round class="ml-2 flex-shrink-0" @click="applyPreset(preset)">
          {{ $t('theme.appearance.preset.apply') }}
        </NButton>
      </div>

      <p class="line-clamp-2 mb-3 text-xs text-gray-500 leading-4">{{ getPresetDesc(preset) }}</p>

      <div class="flex items-center justify-between">
        <!-- 预设颜色预览 -->
        <div class="flex gap-1">
          <div
            v-for="(color, key) in { primary: preset.themeColor, ...preset.otherColor }"
            :key="key"
            class="h-3 w-3 cursor-pointer border border-white/30 rounded-full transition-transform hover:scale-110"
            :style="{ backgroundColor: color }"
            :class="{ 'ring-1 ring-primary/50': key === 'primary' }"
            :title="key"
          />
        </div>
        <!-- 预设状态预览：主题模式/灰度标识 -->
        <div class="flex items-center gap-1">
          <div class="text-lg">
            {{ preset.themeScheme === 'dark' ? '🌙' : '☀️' }}
          </div>
          <div class="text-lg">
            {{ preset.grayscale ? '🎨' : '' }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
