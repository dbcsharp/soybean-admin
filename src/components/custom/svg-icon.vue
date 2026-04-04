<script setup lang="ts">
import { computed, useAttrs } from 'vue';
import { Icon } from '@iconify/vue';

// 组件选项：设置组件名称，并禁用 inheritAttrs 以便手动透传 class/style
defineOptions({ name: 'SvgIcon', inheritAttrs: false });

/**
 * Props
 *
 * - Support iconify and local svg icon
 * - If icon and localIcon are passed at the same time, localIcon will be rendered first
 */
interface Props {
  /** Iconify icon name */
  icon?: string;
  /** Local svg icon name */
  localIcon?: string;
}

// 声明 props
const props = defineProps<Props>();

// 读取外部 attrs（class/style）
const attrs = useAttrs();

// 提取并透传 class/style（避免把无关 attrs 透传给 svg/icon）
const bindAttrs = computed<{ class: string; style: string }>(() => ({
  class: (attrs.class as string) || '',
  style: (attrs.style as string) || ''
}));

// 计算本地 svg symbol id（prefix 来自 VITE_ICON_LOCAL_PREFIX）
const symbolId = computed(() => {
  const { VITE_ICON_LOCAL_PREFIX: prefix } = import.meta.env;

  const defaultLocalIcon = 'no-icon';

  const icon = props.localIcon || defaultLocalIcon;

  return `#${prefix}-${icon}`;
});

/** If localIcon is passed, render localIcon first */
// 是否优先渲染本地 svg（传了 localIcon 或未传 icon 时优先本地）
const renderLocalIcon = computed(() => props.localIcon || !props.icon);
</script>

<template>
  <!-- 本地 svg 与 iconify 图标统一入口：localIcon 优先 -->
  <template v-if="renderLocalIcon">
    <svg aria-hidden="true" width="1em" height="1em" v-bind="bindAttrs">
      <use :xlink:href="symbolId" fill="currentColor" />
    </svg>
  </template>
  <template v-else>
    <Icon v-if="icon" :icon="icon" v-bind="bindAttrs" />
  </template>
</template>

<style scoped></style>
