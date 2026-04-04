<script setup lang="ts">
import type { PopoverPlacement } from 'naive-ui';
import { twMerge } from 'tailwind-merge';

// 组件选项：设置组件名称，并禁用 inheritAttrs 以便手动透传
defineOptions({
  name: 'ButtonIcon',
  inheritAttrs: false
});

// 组件 Props：图标按钮的样式/图标/tooltip 等配置
interface Props {
  /** Button class */
  class?: string;
  /** Iconify icon name */
  icon?: string;
  /** Tooltip content */
  tooltipContent?: string;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
  zIndex?: number;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
  icon: '',
  tooltipContent: '',
  tooltipPlacement: 'bottom',
  zIndex: 98
});

// 默认按钮样式（高度 + 图标字号）
const DEFAULT_CLASS = 'h-[36px] text-icon';
</script>

<template>
  <!-- 带 Tooltip 的图标按钮：disabled 时不显示 tooltip -->
  <NTooltip :placement="tooltipPlacement" :z-index="zIndex" :disabled="!tooltipContent">
    <template #trigger>
      <!-- 按钮主体：合并默认 class 与外部传入 class，并透传 attrs -->
      <NButton quaternary :class="twMerge(DEFAULT_CLASS, props.class)" v-bind="$attrs">
        <div class="flex-center gap-8px">
          <!-- 默认插槽优先：未提供插槽时渲染 SvgIcon -->
          <slot>
            <SvgIcon :icon="icon" />
          </slot>
        </div>
      </NButton>
    </template>
    <!-- tooltip 文案 -->
    {{ tooltipContent }}
  </NTooltip>
</template>

<style scoped></style>
