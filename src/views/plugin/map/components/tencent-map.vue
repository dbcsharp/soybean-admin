<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { TENCENT_MAP_SDK_URL } from '@/constants/map-sdk';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'TencentMap' });

// 动态加载腾讯地图 SDK 脚本
const { load } = useScriptTag(TENCENT_MAP_SDK_URL);

// 地图容器 DOM 引用
const domRef = ref<HTMLDivElement | null>(null);

// 渲染腾讯地图（中文说明：等待 SDK 加载完成后初始化地图实例）
async function renderMap() {
  // 加载 SDK（true 表示立即加载）
  await load(true);
  // 容器不存在则直接返回
  if (!domRef.value) return;

  // 创建地图实例
  const map = new TMap.Map(domRef.value, {
    center: new TMap.LatLng(39.98412, 116.307484),
    zoom: 11,
    viewMode: '3D'
  });
  void map;
  // renderMap 函数结束
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
