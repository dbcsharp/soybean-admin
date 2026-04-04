<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useScriptTag } from '@vueuse/core';
import { BAIDU_MAP_SDK_URL } from '@/constants/map-sdk';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({ name: 'BaiduMap' });

// 百度地图脚本加载时需要指定 HOST_TYPE（用于地图服务类型）
window.HOST_TYPE = '2';

// 动态加载百度地图 SDK 脚本
const { load } = useScriptTag(BAIDU_MAP_SDK_URL);

// 地图容器 DOM 引用
const domRef = ref<HTMLDivElement>();

// 渲染百度地图（中文说明：等待 SDK 加载完成后初始化地图实例）
async function renderMap() {
  // 加载 SDK（true 表示立即加载）
  await load(true);
  // 容器不存在则直接返回
  if (!domRef.value) return;
  // 初始化地图实例
  const map = new BMap.Map(domRef.value);
  // 创建中心点坐标
  const point = new BMap.Point(114.05834626586915, 22.546789983033168);
  // 设置中心点并设置缩放等级
  map.centerAndZoom(point, 15);
  // 启用滚轮缩放
  map.enableScrollWheelZoom();
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
