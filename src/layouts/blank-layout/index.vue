<script setup lang="ts">
import GlobalContent from '../modules/global-content/index.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'BlankLayout'
});
</script>

<template>
  <!-- 空白布局：仅渲染内容区（常用于 iframe/登录等无需 header/sider/tab 的页面） -->
  <GlobalContent :show-padding="false" />
</template>

<style scoped></style>
