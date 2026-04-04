<script setup lang="ts">
// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'GlobalFooter'
});
</script>

<template>
  <!-- 全局底部：展示许可证与版权信息 -->
  <DarkModeContainer class="h-full flex-center">
    <a href="https://github.com/soybeanjs/soybean-admin/blob/main/LICENSE" target="_blank" rel="noopener noreferrer">
      Copyright MIT © 2021 Soybean
    </a>
  </DarkModeContainer>
</template>

<style scoped></style>
