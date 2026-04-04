<script lang="ts" setup>
import { computed } from 'vue';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'PinToggler' });

// 组件 Props：pin=true 表示已固定
interface Props {
  pin?: boolean;
}

// 声明 props
const props = defineProps<Props>();

// 根据 pin 状态切换图标
const icon = computed(() => (props.pin ? 'mdi-pin-off' : 'mdi-pin'));
</script>

<template>
  <!-- 固定按钮：用于 mix 子菜单固定/取消固定 -->
  <ButtonIcon
    :tooltip-content="pin ? $t('icon.unpin') : $t('icon.pin')"
    tooltip-placement="bottom-start"
    :z-index="100"
  >
    <SvgIcon :icon="icon" />
  </ButtonIcon>
</template>

<style scoped></style>
