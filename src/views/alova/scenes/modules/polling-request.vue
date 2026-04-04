<script setup lang="ts">
import { ref } from 'vue';
import { actionDelegationMiddleware, useAutoRequest } from '@sa/alova/client';
import { alova } from '@/service-alova/request';

// 自动请求示例：轮询请求（pollingTime=3000ms）
const getLastTime = alova.Get<{ time: string }>('/mock/getLastTime', { cacheFor: null });
// 是否暂停轮询
const isStop = ref(false);
// useAutoRequest：按 pollingTime 定时触发请求，并通过中间件控制是否执行
const { loading, data } = useAutoRequest(getLastTime, {
  // 轮询间隔（毫秒）
  pollingTime: 3000,
  // 初始数据（避免 data 为空）
  initialData: {
    time: ''
  },
  // 中间件：用于跨组件触发与暂停/恢复控制
  async middleware(_, next) {
    // 触发 action 委托（用于跨组件统一触发）
    await actionDelegationMiddleware('autoRequest:3')(_, () => Promise.resolve());
    // 未暂停时才继续执行请求
    if (!isStop.value) {
      next();
    }
  }
});

// 切换暂停状态（中文说明：暂停后不再执行 next）
const toggleStop = () => {
  isStop.value = !isStop.value;
};
</script>

<template>
  <!-- 轮询自动请求示例 -->
  <NSpace vertical>
    <!-- 提示说明 -->
    <NAlert type="info">
      {{ $t('page.alova.scenes.pollingRequestTips') }}
    </NAlert>
    <!-- 暂停/开始按钮 -->
    <NButton type="primary" @click="toggleStop">
      <icon-carbon-play v-if="isStop" class="mr-2" />
      <icon-carbon-stop v-else class="mr-2" />
      {{ isStop ? $t('page.alova.scenes.startRequest') : $t('page.alova.scenes.stopRequest') }}
    </NButton>
    <!-- 刷新时间展示 -->
    <NSpace align="center">
      <span>{{ $t('page.alova.scenes.refreshTime') }}: {{ data.time || '--' }}</span>
      <NSpin v-if="loading" :size="12" />
    </NSpace>
  </NSpace>
</template>
