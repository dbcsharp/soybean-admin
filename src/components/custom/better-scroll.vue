<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import BScroll from '@better-scroll/core';
import type { Options } from '@better-scroll/core';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'BetterScroll' });

// 组件 Props：BetterScroll 初始化配置
interface Props {
  /**
   * BetterScroll options
   *
   * @link https://better-scroll.github.io/docs/zh-CN/guide/base-scroll-options.html
   */
  options: Options;
}

// 声明 props
const props = defineProps<Props>();

// wrapper 容器引用
const bsWrapper = ref<HTMLElement>();
// content 容器引用
const bsContent = ref<HTMLElement>();
// 监听 wrapper 宽度变化（影响横向滚动）
const { width: wrapWidth } = useElementSize(bsWrapper);
// 监听 content 尺寸变化（用于 refresh）
const { width, height } = useElementSize(bsContent);

// BetterScroll 实例引用
const instance = ref<BScroll>();
// 是否开启纵向滚动（用于决定 content 是否占满高度）
const isScrollY = computed(() => Boolean(props.options.scrollY));

// 初始化 BetterScroll
function initBetterScroll() {
  if (!bsWrapper.value) return;
  instance.value = new BScroll(bsWrapper.value, props.options);
}

// refresh BS when scroll element size changed
// 尺寸变化时刷新 BetterScroll，确保滚动区域正确
watch([() => wrapWidth.value, () => width.value, () => height.value], () => {
  instance.value?.refresh();
});

// 组件挂载后初始化
onMounted(() => {
  initBetterScroll();
});

// 对外暴露实例引用
defineExpose({ instance });
</script>

<template>
  <!-- BetterScroll 容器：外层 wrapper + 内层 content -->
  <div ref="bsWrapper" class="h-full text-left">
    <div ref="bsContent" class="inline-block" :class="{ 'h-full': !isScrollY }">
      <slot></slot>
    </div>
  </div>
</template>

<style scoped></style>
