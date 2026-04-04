<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { html } from 'pinyin-pro';
import domPurify from 'dompurify';

// 三个渲染容器引用（分别展示常规/无音调/自定义样式）
const domRef = ref<HTMLElement | null>(null);
const domRef2 = ref<HTMLElement | null>(null);
const domRef3 = ref<HTMLElement | null>(null);

// 渲染拼音 HTML（使用 pinyin-pro 生成 html，并用 domPurify 进行 XSS 清洗）
function renderHtml() {
  if (!domRef.value || !domRef2.value || !domRef3.value) return;

  // 示例文本
  const text = 'SoybeanAdmin是一个清新优雅、高颜值且功能强大的后台管理模板';

  // 生成带音调的拼音 html
  const code = domPurify.sanitize(html(text));
  // 生成不带音调的拼音 html
  const code2 = domPurify.sanitize(html(text, { toneType: 'none' }));

  // 写入 DOM：常规
  domRef.value.innerHTML = code;
  // 写入 DOM：不带音调
  domRef2.value.innerHTML = code2;
  // 写入 DOM：自定义样式（复用 code）
  domRef3.value.innerHTML = code;
}

// 组件挂载后渲染
onMounted(() => {
  renderHtml();
});
</script>

<template>
  <!-- 拼音插件页：pinyin-pro 示例 -->
  <div>
    <NCard title="pinyin 插件" :bordered="false" class="h-full card-wrapper">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/zh-lx/pinyin-pro" />
        <WebSiteLink label="文档地址：" link="https://pinyin-pro.cn/" />
      </NSpace>
      <!-- 常规使用 -->
      <NDivider title-placement="left">常规使用</NDivider>
      <p ref="domRef" class="text-18px"></p>
      <!-- 不带音调 -->
      <NDivider title-placement="left">不带音调</NDivider>
      <p ref="domRef2" class="text-18px"></p>
      <!-- 自定义样式 -->
      <NDivider title-placement="left">自定义样式</NDivider>
      <p ref="domRef3" class="custom-style text-18px"></p>
    </NCard>
  </div>
</template>

<style lang="scss" scoped>
.custom-style {
  :deep(.py-result-item) {
    .py-chinese-item {
      --uno: text-primary;
    }

    .py-pinyin-item {
      --uno: text-error;
    }
  }
}
</style>
