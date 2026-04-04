<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouterPush } from '@/hooks/common/router';
import { $t } from '@/locales';

// 获取当前路由（用于展示 query 参数）
const route = useRoute();
// 获取路由跳转方法（用于返回 Tab 示例页）
const { routerPushByKey } = useRouterPush();

// 将 route.query 转为字符串用于展示
const routeQuery = computed(() => JSON.stringify(route.query));
</script>

<template>
  <!-- 多标签页示例：展示路由参数，并提供返回按钮 -->
  <div>
    <LookForward>
      <div>
        <!-- 返回 Tab 示例页 -->
        <NButton @click="routerPushByKey('function_tab')">{{ $t('page.function.multiTab.backTab') }}</NButton>
        <!-- 路由参数展示 -->
        <div class="py-24px">{{ $t('page.function.multiTab.routeParam') }}: {{ routeQuery }}</div>
      </div>
    </LookForward>
  </div>
</template>

<style scoped></style>
