<script setup lang="ts">
// Iframe 页面组件：接收 url 并在 iframe 中展示外部站点
interface Props {
  // Iframe 地址
  url: string;
  // Props 接口定义结束
}

// 声明组件 props
defineProps<Props>();
</script>

<template>
  <!-- 容器占满可用高度 -->
  <div class="h-full">
    <!-- Iframe 页面：占满容器 -->
    <iframe id="iframePage" class="size-full" :src="url"></iframe>
  </div>
</template>

<style scoped></style>
