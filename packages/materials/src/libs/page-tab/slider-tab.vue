<script setup lang="ts">
import type { PageTabProps } from '../../types';
import style from './index.module.css';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'SliderTab'
});

// 声明 props（PageTabProps：darkMode/active/activeColor 等）
defineProps<PageTabProps>();

// 插槽函数类型
type SlotFn = (props?: Record<string, unknown>) => any;

// 插槽类型定义
type Slots = {
  /**
   * 默认插槽：标签页中间内容
   */
  default?: SlotFn;
  /**
   * 前置插槽：标签页左侧内容
   */
  prefix?: SlotFn;
  /**
   * 后置插槽：标签页右侧内容
   */
  suffix?: SlotFn;
};

// 声明 slots
defineSlots<Slots>();
</script>

<template>
  <!-- Slider 风格标签页：通过 css module 控制暗黑/激活样式 -->
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-6px whitespace-nowrap px-12px py-4px"
    :class="[
      style['slider-tab'],
      { [style['slider-tab_dark']]: darkMode },
      { [style['slider-tab_active']]: active },
      { [style['slider-tab_active_dark']]: active && darkMode }
    ]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
