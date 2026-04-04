<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import type { PopoverPlacement } from 'naive-ui';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'IconTooltip' });

// 组件 Props：图标（icon/localIcon）、描述文本与 tooltip 位置
interface Props {
  icon?: string;
  localIcon?: string;
  desc?: string;
  placement?: PopoverPlacement;
}

// 声明 props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  icon: 'mdi-help-circle',
  localIcon: '',
  desc: '',
  placement: 'top'
});

// 读取插槽（用于判断是否提供自定义 trigger）
const slots = useSlots();
// 是否提供自定义触发器插槽
const hasCustomTrigger = computed(() => Boolean(slots.trigger));

// 无 trigger 插槽时必须提供 icon 或 localIcon
if (!hasCustomTrigger.value && !props.icon && !props.localIcon) {
  throw new Error('icon or localIcon is required when no custom trigger slot is provided');
}
</script>

<template>
  <!-- 图标提示：可用 trigger 插槽自定义触发器，否则默认显示 SvgIcon -->
  <NTooltip :placement="placement">
    <template #trigger>
      <slot name="trigger">
        <div class="cursor-pointer">
          <SvgIcon :icon="icon" :local-icon="localIcon" />
        </div>
      </slot>
    </template>
    <slot>
      <span>{{ desc }}</span>
    </slot>
  </NTooltip>
</template>
