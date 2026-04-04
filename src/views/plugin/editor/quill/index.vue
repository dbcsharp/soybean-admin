<script setup lang="ts">
import { onMounted, ref } from 'vue';
import WangEditor from 'wangeditor';

// 富文本编辑器实例引用
const editor = ref<WangEditor>();
// 编辑器挂载容器 DOM 引用
const domRef = ref<HTMLElement>();

// 渲染 WangEditor（创建实例、设置配置并初始化编辑器）
function renderWangEditor() {
  editor.value = new WangEditor(domRef.value);
  setEditorConfig();
  editor.value.create();
}

// 设置编辑器配置（调整 zIndex，避免被抽屉/弹窗遮挡）
function setEditorConfig() {
  if (editor.value?.config?.zIndex) {
    editor.value.config.zIndex = 10;
  }
}

// 组件挂载后渲染编辑器
onMounted(() => {
  renderWangEditor();
});
</script>

<template>
  <!-- 富文本插件页：WangEditor 示例 -->
  <div class="h-full">
    <NCard title="富文本插件" :bordered="false" class="card-wrapper">
      <!-- 编辑器容器 -->
      <div ref="domRef" class="bg-white dark:bg-dark"></div>
      <template #footer>
        <!-- 项目地址 -->
        <GithubLink link="https://github.com/wangeditor-team/wangEditor" />
      </template>
    </NCard>
  </div>
</template>

<style scoped>
:deep(.w-e-toolbar) {
  background: inherit !important;
  border-color: #999 !important;
}

:deep(.w-e-text-container) {
  background: inherit;
  border-color: #999 !important;
}
</style>
