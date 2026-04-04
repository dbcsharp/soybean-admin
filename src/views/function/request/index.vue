<script setup lang="ts">
import { fetchCustomBackendError } from '@/service/api';
import { $t } from '@/locales';

// 请求示例：通过模拟后端错误码演示登出/弹窗登出/刷新 token 与错误提示去重
async function logout() {
  // 模拟后端返回登出错误码（触发直接登出）
  await fetchCustomBackendError('8888', $t('request.logoutMsg'));
  // logout 函数结束
}

// 请求示例：模拟弹窗登出（触发 modal 提示后登出）
async function logoutWithModal() {
  // 模拟后端返回弹窗登出错误码（触发弹窗）
  await fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'));
  // logoutWithModal 函数结束
}

// 请求示例：模拟 token 过期（触发刷新 token 与重试）
async function refreshToken() {
  // 模拟后端返回 token 过期错误码
  await fetchCustomBackendError('9999', $t('request.tokenExpired'));
  // refreshToken 函数结束
}

// 请求示例：重复 message 错误只提示一次（中文说明：并发触发相同 msg 的错误）
async function handleRepeatedMessageError() {
  // 并发请求：同一错误码+消息重复多次
  await Promise.all([
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('2222', $t('page.function.request.repeatedErrorMsg1')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2')),
    fetchCustomBackendError('3333', $t('page.function.request.repeatedErrorMsg2'))
  ]);
  // handleRepeatedMessageError 函数结束
}

// 请求示例：重复 modal 错误只弹一次（中文说明：并发触发相同 modal 登出错误）
async function handleRepeatedModalError() {
  // 并发请求：同一弹窗登出错误重复多次
  await Promise.all([
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg')),
    fetchCustomBackendError('7777', $t('request.logoutWithModalMsg'))
  ]);
  // handleRepeatedModalError 函数结束
}
</script>

<template>
  <!-- 请求示例页：演示请求错误处理策略 -->
  <NSpace vertical :size="16">
    <!-- 直接登出示例 -->
    <NCard :title="$t('request.logout')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logout">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <!-- 弹窗登出示例 -->
    <NCard :title="$t('request.logoutWithModal')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="logoutWithModal">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <!-- 刷新 token 示例 -->
    <NCard :title="$t('request.refreshToken')" :bordered="false" size="small" segmented class="card-wrapper">
      <NButton @click="refreshToken">{{ $t('common.trigger') }}</NButton>
    </NCard>
    <!-- 错误去重示例 -->
    <NCard
      :title="$t('page.function.request.repeatedErrorOccurOnce')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <!-- 重复 message 错误 -->
      <NButton @click="handleRepeatedMessageError">{{ $t('page.function.request.repeatedError') }}(Message)</NButton>
      <!-- 重复 modal 错误 -->
      <NButton class="ml-12px" @click="handleRepeatedModalError">
        {{ $t('page.function.request.repeatedError') }}(Modal)
      </NButton>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
