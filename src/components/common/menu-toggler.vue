<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'MenuToggler' });

// 组件 Props：折叠状态/图标风格/zIndex
interface Props {
  /** Show collapsed icon */
  collapsed?: boolean;
  /** Arrow style icon */
  arrowIcon?: boolean;
  zIndex?: number;
}

// 声明 props 并设置默认值
const props = withDefaults(defineProps<Props>(), {
  arrowIcon: false,
  zIndex: 98
});

// 数字布尔类型（用于 icon map 索引）
type NumberBool = 0 | 1;

// 根据 arrowIcon/collapsed 计算当前显示的 iconify 图标名
const icon = computed(() => {
  const icons: Record<NumberBool, Record<NumberBool, string>> = {
    0: {
      0: 'line-md:menu-fold-left',
      1: 'line-md:menu-fold-right'
    },
    1: {
      0: 'ph-caret-double-left-bold',
      1: 'ph-caret-double-right-bold'
    }
  };

  const arrowIcon = Number(props.arrowIcon || false) as NumberBool;

  const collapsed = Number(props.collapsed || false) as NumberBool;

  return icons[arrowIcon][collapsed];
});
</script>

<template>
  <!-- 菜单折叠按钮：根据 collapsed 切换 tooltip 与图标 -->
  <ButtonIcon
    :key="String(collapsed)"
    :tooltip-content="collapsed ? $t('icon.expand') : $t('icon.collapse')"
    tooltip-placement="bottom-start"
    :z-index="zIndex"
  >
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
