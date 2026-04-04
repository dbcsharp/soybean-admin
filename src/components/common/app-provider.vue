<script setup lang="ts">
import { createTextVNode, defineComponent } from 'vue';
import { useDialog, useLoadingBar, useMessage, useNotification } from 'naive-ui';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'AppProvider'
});

// ContextHolder：用于注册 Naive UI 的全局 API 到 window（$message/$dialog/$loadingBar/$notification）
const ContextHolder = defineComponent({
  name: 'ContextHolder',
  setup() {
    // 注册全局实例（在 Naive Provider 内调用 hooks 才能生效）
    function register() {
      window.$loadingBar = useLoadingBar();
      window.$dialog = useDialog();
      window.$message = useMessage();
      window.$notification = useNotification();
    }

    // 初始化注册
    register();

    // ContextHolder 不渲染任何可见内容
    return () => createTextVNode();
  }
});
</script>

<template>
  <!-- Naive UI Provider 树：提供 LoadingBar/Dialog/Notification/Message 上下文 -->
  <NLoadingBarProvider>
    <NDialogProvider>
      <NNotificationProvider>
        <NMessageProvider>
          <!-- 注册 window 全局 API -->
          <ContextHolder />
          <!-- 业务内容插槽 -->
          <slot></slot>
        </NMessageProvider>
      </NNotificationProvider>
    </NDialogProvider>
  </NLoadingBarProvider>
</template>

<style scoped></style>
