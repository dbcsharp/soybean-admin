<script lang="ts" setup>
import { ref } from 'vue';
import { useClipboard } from '@vueuse/core';

// Clipboard Hook：提供 copy 方法与兼容性检测
const { copy, isSupported } = useClipboard();

// 需要复制的文本内容
const source = ref('');
const sourceTest = ref('');

// 执行复制（先做兼容性与输入校验，再调用 copy）
async function handleCopy() {
  if (!isSupported) {
    window.$message?.error('您的浏览器不支持Clipboard API');
    return;
  }

  if (!source.value) {
    window.$message?.error('请输入要复制的内容');
    return;
  }

  await copy(source.value);
  window.$message?.success(`复制成功：${source.value}`);
}
</script>

<template>
  <!-- 文本复制插件页：Clipboard API 示例 -->
  <div class="h-full">
    <NCard title="文本复制" :bordered="false" class="h-full card-wrapper">
      <!-- 输入 + 复制按钮 -->
      <NInputGroup>
        <NInput v-model:value="source" placeholder="请输入要复制的内容吧" />
        <NButton type="primary" @click="handleCopy">复制</NButton>
      </NInputGroup>
      <!-- 输入 + 复制按钮 -->
      <NInputGroup>
        <NInput v-model:value="sourceTest" placeholder="请输入要复制的内容吧" />
        <NButton v-copy="sourceTest" type="primary">复制 v-copy</NButton>
      </NInputGroup>
      <NTooltip content="复制">
        <template #trigger>
          <icon-mynaui:copy class="operate-shadow operate-item" tootip="复制" />
        </template>
        <span>I wish they all could be California girls</span>
      </NTooltip>
    </NCard>
  </div>
</template>
