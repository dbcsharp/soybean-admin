<script setup lang="ts">
import { computed } from 'vue';
import type { Component } from 'vue';
import type { PageTabMode, PageTabProps } from '../../types';
import { ACTIVE_COLOR, createTabCssVars } from './shared';
import ChromeTab from './chrome-tab.vue';
import ButtonTab from './button-tab.vue';
import SliderTab from './slider-tab.vue';
import SvgClose from './svg-close.vue';
import style from './index.module.css';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'PageTab'
});

// 声明 props 并设置默认值（mode 默认 chrome，默认可关闭）
const props = withDefaults(defineProps<PageTabProps>(), {
  mode: 'chrome',
  commonClass: 'transition-all-300',
  activeColor: ACTIVE_COLOR,
  closable: true
});

// 组件事件：关闭标签页
interface Emits {
  (e: 'close'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 当前使用的标签组件与对应 class（根据 mode 映射到 chrome/button/slider 组件）
const activeTabComponent = computed(() => {
  const { mode, chromeClass, buttonClass, sliderClass } = props;

  const tabComponentMap = {
    chrome: {
      component: ChromeTab,
      class: chromeClass
    },
    button: {
      component: ButtonTab,
      class: buttonClass
    },
    slider: {
      component: SliderTab,
      class: sliderClass
    }
  } satisfies Record<PageTabMode, { component: Component; class?: string }>;

  return tabComponentMap[mode];
});

// CSS 变量：基于 activeColor 生成不同透明度/混合色（用于不同 Tab 样式共享）
const cssVars = computed(() => createTabCssVars(props.activeColor));

// 透传给子 Tab 组件的 props（剔除 class props，避免无意义透传）
const bindProps = computed(() => {
  const { chromeClass: _chromeCls, buttonClass: _btnCls, sliderClass: _sliderCls, ...rest } = props;

  return rest;
});

// 触发关闭事件
function handleClose() {
  emit('close');
}
</script>

<template>
  <!-- Tab 容器：根据 mode 动态渲染不同风格的 Tab 组件 -->
  <component :is="activeTabComponent.component" :class="activeTabComponent.class" :style="cssVars" v-bind="bindProps">
    <template #prefix>
      <slot name="prefix"></slot>
    </template>
    <slot></slot>
    <template #suffix>
      <slot name="suffix">
        <!-- 默认关闭按钮：pointerdown.stop 避免触发父级选中等事件 -->
        <SvgClose v-if="closable" :class="[style['svg-close']]" @pointerdown.stop="handleClose" />
      </slot>
    </template>
  </component>
</template>

<style scoped></style>
