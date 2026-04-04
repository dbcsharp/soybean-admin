<script setup lang="ts">
import { computed } from 'vue';
import type { PopoverPlacement } from 'naive-ui';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'ThemeSchemaSwitch' });

// 组件 Props：主题模式/tooltip 配置
interface Props {
  /** Theme schema */
  themeSchema: UnionKey.ThemeScheme;
  /** Show tooltip */
  showTooltip?: boolean;
  /** Tooltip placement */
  tooltipPlacement?: PopoverPlacement;
}

const props = withDefaults(defineProps<Props>(), {
  showTooltip: true,
  tooltipPlacement: 'bottom'
});

// 组件事件：切换主题模式
interface Emits {
  (e: 'switch'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 点击切换：触发 switch 事件
function handleSwitch() {
  emit('switch');
}

// 主题模式对应图标
const icons: Record<UnionKey.ThemeScheme, string> = {
  light: 'material-symbols:sunny',
  dark: 'material-symbols:nightlight-rounded',
  auto: 'material-symbols:hdr-auto'
};

// 当前图标
const icon = computed(() => icons[props.themeSchema]);

// tooltip 文案（中文说明：showTooltip=false 时返回空字符串）
const tooltipContent = computed(() => {
  if (!props.showTooltip) return '';

  return $t('icon.themeSchema');
});
</script>

<template>
  <!-- 主题模式切换按钮：点击触发 switch -->
  <ButtonIcon
    :icon="icon"
    :tooltip-content="tooltipContent"
    :tooltip-placement="tooltipPlacement"
    @click="handleSwitch"
  />
</template>

<style scoped></style>
