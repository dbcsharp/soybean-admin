<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { AMAP_SDK_URL } from '@/constants/map-sdk';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'GaodeMap' });

// 动态加载高德地图 SDK 脚本
const { load } = useScriptTag(AMAP_SDK_URL);

// 地图容器 DOM 引用
const domRef = ref<HTMLDivElement>();

// 渲染高德地图（等待 SDK 加载完成后初始化地图实例）
async function renderMap() {
  // 加载 SDK（true 表示立即加载）
  await load(true);
  // 容器不存在则直接返回
  if (!domRef.value) return;
  // 初始化地图实例
  const map = new AMap.Map(domRef.value, {
    zoom: 11,
    center: [114.05834626586915, 22.546789983033168],
    viewMode: '3D'
  });
  // 读取中心点（占位调用，确保实例可用）
  map.getCenter();
}

// 组件挂载后渲染地图
onMounted(() => {
  renderMap();
});
</script>

<template>
  <!-- 地图容器：占满父容器 -->
  <div ref="domRef" class="h-full w-full"></div>
</template>

<style scoped></style>
