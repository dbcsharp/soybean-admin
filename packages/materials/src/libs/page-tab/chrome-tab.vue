<script setup lang="ts">
import type { PageTabProps } from '../../types';
import ChromeTabBg from './chrome-tab-bg.vue';
import style from './index.module.css';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ChromeTab'
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
  <!-- Chrome 风格标签页：背景使用 SVG，divider 用于分割相邻标签 -->
  <div
    class=":soy: relative inline-flex cursor-pointer items-center justify-center gap-16px whitespace-nowrap px-24px py-6px -mr-18px"
    :class="[
      style['chrome-tab'],
      { [style['chrome-tab_dark']]: darkMode },
      { [style['chrome-tab_active']]: active },
      { [style['chrome-tab_active_dark']]: active && darkMode }
    ]"
  >
    <!-- SVG 背景：使用 pointer-events-none 避免遮挡点击 -->
    <div class=":soy: pointer-events-none absolute left-0 top-0 h-full w-full -z-1" :class="[style['chrome-tab__bg']]">
      <ChromeTabBg />
    </div>
    <slot name="prefix"></slot>
    <slot></slot>
    <slot name="suffix"></slot>
    <!-- 右侧分隔线 -->
    <div class=":soy: absolute right-7px h-16px w-1px bg-#1f2225" :class="[style['chrome-tab-divider']]"></div>
  </div>
</template>

<style scoped></style>
