<script setup lang="ts">
import { useVChart } from '@/hooks/common/vchart';
import {
  barMarkPointSpec,
  circularProgressTickSpec,
  histogramDifferentBinSpec,
  liquidChartSmartInvertSpec,
  rankingBarSpec,
  shapeWordCloudSpec,
  stackedDashAreaSpec
} from './data';

// VChart 示例页：展示多个 VChart 图表示例（面积图/柱状图/直方图/排行榜/环形进度/水滴图/词云等）
const { domRef: stackedDashAreaRef } = useVChart(() => stackedDashAreaSpec);
const { domRef: barMarkPointRef } = useVChart(() => barMarkPointSpec);
const { domRef: histogramDifferentBinRef } = useVChart(() => histogramDifferentBinSpec);
const { domRef: rankingBarRef } = useVChart(() => rankingBarSpec);
const { domRef: shapeWordCloudRef } = useVChart(() => shapeWordCloudSpec);
const { domRef: circularProgressTickRef } = useVChart(() => circularProgressTickSpec);
const { domRef: liquidChartSmartInvertRef } = useVChart(() => liquidChartSmartInvertSpec);
</script>

<template>
  <!-- VChart 图表示例集合 -->
  <NSpace vertical :size="16">
    <!-- 资源链接卡片 -->
    <NCard :bordered="false" title="VChart" class="h-full card-wrapper">
      <WebSiteLink label="More Demos: " link="https://www.visactor.com/vchart/example" />
    </NCard>
    <!-- 堆叠虚线面积图 -->
    <NCard title="Stacked Dash Area Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="stackedDashAreaRef" class="h-400px" />
    </NCard>
    <!-- 柱状图标注点图 -->
    <NCard title="Bar Mark Point Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="barMarkPointRef" class="h-400px" />
    </NCard>
    <!-- 不同分箱直方图 -->
    <NCard title="Histogram Different Bin Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="histogramDifferentBinRef" class="h-400px" />
    </NCard>
    <!-- 排行榜柱状图 -->
    <NCard title="Ranking Bar Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="rankingBarRef" class="h-400px" />
    </NCard>
    <!-- 环形进度刻度图 -->
    <NCard title="Circular Progress Tick Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="circularProgressTickRef" class="h-400px" />
    </NCard>
    <!-- 水滴进度图（智能反色） -->
    <NCard title="Liquid Chart Smart Invert Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="liquidChartSmartInvertRef" class="h-400px" />
    </NCard>
    <!-- 形状词云 -->
    <NCard title="Shape Word Cloud Chart" :bordered="false" class="h-full card-wrapper">
      <div ref="shapeWordCloudRef" class="h-400px" />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
