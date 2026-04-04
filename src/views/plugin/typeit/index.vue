<script lang="ts" setup>
import { onMounted, shallowRef } from 'vue';
import TypeIt from 'typeit';
import type { Options } from 'typeit';
import type { El } from 'typeit/dist/types';

// 文本容器引用（TypeIt 会在该元素内执行打字动画）
const textRef = shallowRef<El>();

// 初始化 TypeIt（创建实例并启动动画）
function init() {
  if (!textRef.value) return;

  // TypeIt 配置（字符串/速度/是否循环等）
  const options: Options = {
    strings: 'SoybeanAdmin是一个清新优雅、高颜值且功能强大的后台管理模板',
    lifeLike: true,
    speed: 120,
    loop: true
  };

  // 创建 TypeIt 实例
  const initTypeIt = new TypeIt(textRef.value, options);

  // 启动动画
  initTypeIt.go();
}

// 组件挂载后初始化动画
onMounted(() => {
  init();
});
</script>

<template>
  <!-- 打字机插件页：TypeIt 示例 -->
  <div>
    <NCard title="打字机 插件" :bordered="false" class="h-full card-wrapper">
      <NSpace :vertical="true">
        <GithubLink link="https://github.com/alexmacarthur/typeit" />
        <WebSiteLink label="文档地址：" link="https://www.typeitjs.com/docs/vanilla/usage/" />
      </NSpace>
      <NDivider title-placement="left">基本示例</NDivider>
      <!-- 打字机文本容器 -->
      <span ref="textRef" class="text-18px"></span>
    </NCard>
  </div>
</template>

<style scoped></style>
