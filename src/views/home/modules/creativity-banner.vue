<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'CreativityBanner'
});
</script>

<template>
  <!-- 创意卡片：展示 Banner 图标 -->
  <NCard :title="$t('page.home.creativity')" :bordered="false" size="small" class="h-full card-wrapper">
    <!-- 居中展示本地图标 -->
    <div class="h-full flex-center">
      <icon-local-banner class="text-400px text-primary sm:text-320px" />
    </div>
  </NCard>
</template>

<style scoped></style>
