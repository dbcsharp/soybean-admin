<script setup lang="ts">
import { accessAction } from '@sa/alova/client';

// 跨组件触发请求：通过 accessAction 批量触发所有 autoRequest action 的 send
const handleAutoRequestSend = async () => {
  // 匹配所有以 autoRequest 开头的 action，并依次调用其 send
  accessAction(/^autoRequest/, async ({ send }) => {
    await send();
  });
  // handleAutoRequestSend 函数结束
};
</script>

<template>
  <!-- 手动触发所有自动请求 -->
  <NButton @click="handleAutoRequestSend">{{ $t('page.alova.scenes.triggerAllRequest') }}</NButton>
</template>
