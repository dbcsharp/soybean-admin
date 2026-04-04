<script setup lang="ts">
import type { PageTabProps } from '../../types';
import style from './index.module.css';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ButtonTab'
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
  <!-- Button 风格标签页：通过 css module 控制暗黑/激活样式 -->
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-12px whitespace-nowrap border-(1px solid) rounded-4px px-12px py-4px"
    :class="[
      style['button-tab'],
      { [style['button-tab_dark']]: darkMode },
      { [style['button-tab_active']]: active },
      { [style['button-tab_active_dark']]: active && darkMode }
    ]"
  >
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
  </div>
</template>

<style scoped></style>
