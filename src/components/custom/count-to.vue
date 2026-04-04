<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import { TransitionPresets, useTransition } from '@vueuse/core';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'CountTo'
});

// 组件 Props：数值动画的起止值/时长/格式化配置等
interface Props {
  startValue?: number;
  endValue?: number;
  duration?: number;
  autoplay?: boolean;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  separator?: string;
  decimal?: string;
  useEasing?: boolean;
  transition?: keyof typeof TransitionPresets;
}

const props = withDefaults(defineProps<Props>(), {
  startValue: 0,
  endValue: 2021,
  duration: 1500,
  autoplay: true,
  decimals: 0,
  prefix: '',
  suffix: '',
  separator: ',',
  decimal: '.',
  useEasing: true,
  transition: 'linear'
});

// 动画源值（由 useTransition 平滑过渡到 endValue）
const source = ref(props.startValue);

// 过渡曲线：useEasing=false 时禁用 easing
const transition = computed(() => (props.useEasing ? TransitionPresets[props.transition] : undefined));

// 使用过渡动画生成输出值
const outputValue = useTransition(source, {
  disabled: false,
  duration: props.duration,
  transition: transition.value
});

// 格式化后的展示值
const value = computed(() => formatValue(outputValue.value));

// 格式化数值（中文说明：支持小数位、千分位分隔符、前后缀等）
function formatValue(num: number) {
  const { decimals, decimal, separator, suffix, prefix } = props;

  let number = num.toFixed(decimals);
  number = String(number);

  const x = number.split('.');
  let x1 = x[0];
  const x2 = x.length > 1 ? decimal + x[1] : '';
  const rgx = /(\d+)(\d{3})/;
  if (separator) {
    while (rgx.test(x1)) {
      x1 = x1.replace(rgx, `$1${separator}$2`);
    }
  }

  return prefix + x1 + x2 + suffix;
}

// 启动动画：将 source 设置为 endValue
async function start() {
  await nextTick();
  source.value = props.endValue;
}

// 监听起止值变化：autoplay=true 时自动启动动画
watch(
  [() => props.startValue, () => props.endValue],
  () => {
    if (props.autoplay) {
      start();
    }
  },
  { immediate: true }
);
</script>

<template>
  <!-- 数字滚动：展示格式化后的 value -->
  <span>{{ value }}</span>
</template>

<style scoped></style>
