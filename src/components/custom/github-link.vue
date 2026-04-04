<script setup lang="ts">
import WebSiteLink from './web-site-link.vue';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'GithubLink' });

// 组件 Props：Github 地址
interface Props {
  /** github link */
  link: string;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- Github 链接：基于 WebSiteLink 的二次封装 -->
  <WebSiteLink label="github地址：" :link="link" />
</template>

<style scoped></style>
