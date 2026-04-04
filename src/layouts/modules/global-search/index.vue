<script lang="ts" setup>
import { useBoolean } from '@sa/hooks';
import { $t } from '@/locales';
import SearchModal from './components/search-modal.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'GlobalSearch' });

// 控制搜索弹窗显隐
const { bool: show, toggle } = useBoolean();
</script>

<template>
  <!-- 全局搜索入口按钮：点击打开搜索弹窗 -->
  <ButtonIcon :tooltip-content="$t('common.search')" @click="toggle">
    <icon-uil-search />
  </ButtonIcon>
  <!-- 搜索弹窗：通过 v-model 控制显示 -->
  <SearchModal v-model:show="show" />
</template>

<style lang="scss" scoped></style>
