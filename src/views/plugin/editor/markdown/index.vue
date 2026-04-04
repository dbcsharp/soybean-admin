<script setup lang="ts">
import { onMounted, onUnmounted, ref, watch } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { useThemeStore } from '@/store/modules/theme';

// 获取主题状态（用于切换 Vditor 主题）
const theme = useThemeStore();

// Vditor 实例引用
const vditor = ref<Vditor>();
// 编辑器挂载容器 DOM 引用
const domRef = ref<HTMLElement>();

// 渲染 Vditor（中文说明：创建实例并设置基础配置）
function renderVditor() {
  if (!domRef.value) return;
  vditor.value = new Vditor(domRef.value, {
    minHeight: 400,
    theme: theme.darkMode ? 'dark' : 'classic',
    icon: 'material',
    cache: { enable: false }
  });
}

// 监听暗黑模式变化：动态切换编辑器主题
const stopHandle = watch(
  () => theme.darkMode,
  newValue => {
    const themeMode = newValue ? 'dark' : 'classic';
    vditor.value?.setTheme(themeMode);
  }
);

// 组件挂载后渲染编辑器
onMounted(() => {
  renderVditor();
});

// 组件卸载时停止监听，避免内存泄漏
onUnmounted(() => {
  stopHandle();
});
</script>

<template>
  <!-- Markdown 插件页：Vditor 示例 -->
  <div class="h-full">
    <NCard title="markdown插件" :bordered="false" class="card-wrapper">
      <!-- 编辑器容器 -->
      <div ref="domRef"></div>
      <template #footer>
        <!-- 项目地址 -->
        <GithubLink link="https://github.com/Vanessa219/vditor" />
      </template>
    </NCard>
  </div>
</template>

<style scoped></style>
