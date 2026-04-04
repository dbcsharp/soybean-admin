<script setup lang="ts">
import type { Component } from 'vue';
import { BaiduMap, GaodeMap, TencentMap } from './components';

// 地图 Tab 配置结构（用于渲染不同地图组件的 Tabs）
interface Map {
  // Tab 唯一 id
  id: string;
  // Tab 显示名称
  label: string;
  // 对应地图组件
  component: Component;
  // Map 接口定义结束
}

// 地图列表（按顺序展示高德/腾讯/百度）
const maps: Map[] = [
  { id: 'gaode', label: '高德地图', component: GaodeMap },
  { id: 'tencent', label: '腾讯地图', component: TencentMap },
  { id: 'baidu', label: '百度地图', component: BaiduMap }
];
</script>

<template>
  <!-- 地图插件页：通过 Tabs 切换不同地图 SDK 示例 -->
  <div class="h-full">
    <!-- 使用 NCard 容器承载地图内容 -->
    <NCard title="地图插件" :bordered="false" class="h-full card-wrapper" content-style="overflow:hidden">
      <!-- Tabs 容器：每个 Tab 渲染一个地图组件 -->
      <NTabs type="line" class="h-full flex-col-stretch" pane-class="flex-1-hidden">
        <NTabPane v-for="item in maps" :key="item.id" :name="item.id" :tab="item.label">
          <!-- 动态渲染当前地图组件 -->
          <component :is="item.component" />
        </NTabPane>
      </NTabs>
    </NCard>
  </div>
</template>

<style scoped></style>
