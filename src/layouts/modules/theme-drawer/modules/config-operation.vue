<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import Clipboard from 'clipboard';
import { useThemeStore } from '@/store/modules/theme';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'ConfigOperation'
});

// 获取主题状态（用于读取 settingsJson 与执行 reset）
const themeStore = useThemeStore();

// 触发复制的 DOM 引用（Clipboard 绑定到该节点）
const domRef = ref<HTMLElement | null>(null);

// 初始化剪贴板（绑定复制按钮，并监听成功提示）
function initClipboard() {
  if (!domRef.value) return;

  const clipboard = new Clipboard(domRef.value);

  clipboard.on('success', () => {
    window.$message?.success($t('theme.configOperation.copySuccessMsg'));
  });
}

// 获取复制文本（去掉 JSON key 的双引号，便于粘贴到配置文件）
function getClipboardText() {
  const reg = /"\w+":/g;

  const json = themeStore.settingsJson;

  return json.replace(reg, match => match.replace(/"/g, ''));
}

// 重置配置（恢复默认主题设置）
function handleReset() {
  themeStore.resetStore();

  setTimeout(() => {
    window.$message?.success($t('theme.configOperation.resetSuccessMsg'));
  }, 50);
}

// 复制文本（computed：用于 textarea v-model）
const dataClipboardText = computed(() => getClipboardText());

// 组件挂载后初始化 clipboard
onMounted(() => {
  initClipboard();
});
</script>

<template>
  <!-- 底部操作：重置配置 + 复制当前配置 -->
  <div class="w-full flex justify-between">
    <!-- 复制目标：隐藏 textarea，Clipboard 通过 data-clipboard-target 读取内容 -->
    <textarea id="themeConfigCopyTarget" v-model="dataClipboardText" class="absolute opacity-0 -z-1" />
    <!-- 重置按钮 -->
    <NButton type="error" ghost @click="handleReset">{{ $t('theme.configOperation.resetConfig') }}</NButton>
    <!-- 复制按钮容器：Clipboard 绑定到该节点 -->
    <div ref="domRef" data-clipboard-target="#themeConfigCopyTarget">
      <NButton type="primary">{{ $t('theme.configOperation.copyConfig') }}</NButton>
    </div>
  </div>
</template>

<style scoped></style>
