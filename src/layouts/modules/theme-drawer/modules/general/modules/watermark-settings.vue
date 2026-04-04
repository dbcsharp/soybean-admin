<script setup lang="ts">
import { computed } from 'vue';
import { watermarkTimeFormatOptions } from '@/constants/app';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';
import SettingItem from '../../../components/setting-item.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'WatermarkSettings'
});

// 获取主题状态（水印配置）
const themeStore = useThemeStore();

// 是否显示水印文本输入（水印开启且未启用用户名/时间时显示文本输入）
const isWatermarkTextVisible = computed(
  () => themeStore.watermark.visible && !themeStore.watermark.enableUserName && !themeStore.watermark.enableTime
);
</script>

<template>
  <!-- 水印设置：显隐/用户名/时间/时间格式/自定义文本 -->
  <NDivider>{{ $t('theme.general.watermark.title') }}</NDivider>
  <TransitionGroup tag="div" name="setting-list" class="flex-col-stretch gap-12px">
    <!-- 水印显隐 -->
    <SettingItem key="1" :label="$t('theme.general.watermark.visible')">
      <NSwitch v-model:value="themeStore.watermark.visible" />
    </SettingItem>
    <!-- 用户名水印 -->
    <SettingItem v-if="themeStore.watermark.visible" key="2" :label="$t('theme.general.watermark.enableUserName')">
      <NSwitch :value="themeStore.watermark.enableUserName" @update:value="themeStore.setWatermarkEnableUserName" />
    </SettingItem>
    <!-- 时间水印 -->
    <SettingItem v-if="themeStore.watermark.visible" key="3" :label="$t('theme.general.watermark.enableTime')">
      <NSwitch :value="themeStore.watermark.enableTime" @update:value="themeStore.setWatermarkEnableTime" />
    </SettingItem>
    <!-- 时间格式：仅启用时间水印时显示 -->
    <SettingItem
      v-if="themeStore.watermark.visible && themeStore.watermark.enableTime"
      key="4"
      :label="$t('theme.general.watermark.timeFormat')"
    >
      <NSelect
        v-model:value="themeStore.watermark.timeFormat"
        :options="watermarkTimeFormatOptions"
        size="small"
        class="w-210px"
      />
    </SettingItem>
    <!-- 自定义水印文本：仅用户名/时间都关闭时显示 -->
    <SettingItem v-if="isWatermarkTextVisible" key="5" :label="$t('theme.general.watermark.text')">
      <NInput
        v-model:value="themeStore.watermark.text"
        autosize
        type="text"
        size="small"
        class="w-120px"
        placeholder="SoybeanAdmin"
      />
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
