<script setup lang="ts">
// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'SoybeanAvatar'
});
</script>

<template>
  <!-- Soybean 头像：用于列表/动态等场景的统一头像展示 -->
  <div class="size-72px overflow-hidden rd-1/2">
    <img src="@/assets/imgs/soybean.jpg" class="size-full" />
  </div>
</template>

<style scoped></style>
