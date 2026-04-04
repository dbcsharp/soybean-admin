<script setup lang="ts">
// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'WebSiteLink' });

// 组件 Props：链接标签与链接地址
interface Props {
  /** Web site name */
  label: string;
  /** Web site link */
  link: string;
}

// 声明 props
defineProps<Props>();
</script>

<template>
  <!-- 网站链接：展示 label 与可点击链接 -->
  <p>
    <span>{{ label }}</span>
    <a class="text-blue-500" :href="link" target="#">
      {{ link }}
    </a>
  </p>
</template>

<style scoped></style>
