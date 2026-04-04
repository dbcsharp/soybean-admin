<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LookForward'
});
</script>

<template>
  <!-- 占位组件：用于“敬请期待”等未完成页面展示 -->
  <div class="size-full min-h-520px flex-col-center gap-24px overflow-hidden">
    <div class="flex text-400px text-primary">
      <SvgIcon local-icon="expectation" />
    </div>
    <slot>
      <h3 class="text-28px text-primary font-500">{{ $t('common.lookForward') }}</h3>
    </slot>
  </div>
</template>

<style scoped></style>
