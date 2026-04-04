<script setup lang="ts">
import { $t } from '@/locales';
import CaptchaVerification from './modules/captcha-verification.vue';
import BrowserVisibilityRequest from './modules/browser-visibility-request.vue';
import PollingRequest from './modules/polling-request.vue';
import NetworkToggleRequest from './modules/network-toggle-request.vue';
import CrossComponentRequest from './modules/cross-component-request.vue';
</script>

<template>
  <!-- Alova 场景化请求示例：验证码发送、自动请求与跨组件触发请求 -->
  <NSpace vertical :size="16">
    <!-- 验证码发送/校验示例 -->
    <NCard :title="$t('page.alova.scenes.captchaSend')" :bordered="false" size="small" segmented class="card-wrapper">
      <CaptchaVerification class="w-1/3" />
    </NCard>
    <!-- 自动请求示例：窗口可见性/轮询/网络重连 -->
    <NCard :title="$t('page.alova.scenes.autoRequest')" :bordered="false" size="small" segmented class="card-wrapper">
      <NSpace :wrap="false">
        <BrowserVisibilityRequest />
        <PollingRequest />
        <NetworkToggleRequest />
      </NSpace>
    </NCard>
    <!-- 跨组件触发请求示例 -->
    <NCard
      :title="$t('page.alova.scenes.requestCrossComponent')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <CrossComponentRequest />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
