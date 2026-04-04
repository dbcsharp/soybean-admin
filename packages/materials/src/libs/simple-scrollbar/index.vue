<script setup lang="ts">
import Simplebar from 'simplebar-vue';
import 'simplebar-vue/dist/simplebar.min.css';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'SimpleScrollbar'
});
</script>

<template>
  <!-- 简易滚动条容器：内部使用 simplebar-vue 渲染自定义滚动条 -->
  <div class="h-full flex-1-hidden">
    <!-- Simplebar：自动接管滚动区域并渲染滚动条 -->
    <Simplebar class="h-full">
      <!-- 内容插槽 -->
      <slot />
    </Simplebar>
  </div>
</template>

<style scoped></style>
