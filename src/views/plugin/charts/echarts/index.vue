<script setup lang="ts">
import { onUnmounted } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';
import {
  barOptions,
  gaugeOptions,
  getPictorialBarOption,
  getScatterOption,
  lineOptions,
  pieOptions,
  radarOptions
} from './data';

// ECharts 示例页：展示饼图、折线图、柱状图、雷达图、散点图、象形柱图与仪表盘
const { domRef: pieRef } = useEcharts(() => pieOptions, { onRender() {} });
const { domRef: lineRef } = useEcharts(() => lineOptions, { onRender() {} });
const { domRef: barRef } = useEcharts(() => barOptions, { onRender() {} });
const { domRef: pictorialBarRef } = useEcharts(() => getPictorialBarOption(), { onRender() {} });
const { domRef: radarRef } = useEcharts(() => radarOptions, { onRender() {} });
const { domRef: scatterRef } = useEcharts(() => getScatterOption(), { onRender() {} });
const { domRef: gaugeRef, setOptions: setGaugeOptions } = useEcharts(() => gaugeOptions, { onRender() {} });

// 仪表盘定时器 id（用于每秒更新时间指针）
let intervalId: NodeJS.Timeout;

// 初始化仪表盘：每秒更新时/分/秒指针数据
function initGaugeChart() {
  intervalId = setInterval(() => {
    const date = new Date();
    const second = date.getSeconds();
    const minute = date.getMinutes() + second / 60;
    const hour = (date.getHours() % 12) + minute / 60;

    setGaugeOptions({
      animationDurationUpdate: 300,
      series: [
        {
          name: 'hour',
          animation: hour !== 0,
          data: [{ value: hour }]
        },
        {
          name: 'minute',
          animation: minute !== 0,
          data: [{ value: minute }]
        },
        {
          animation: second !== 0,
          name: 'second',
          data: [{ value: second }]
        }
      ]
    });
  }, 1000);
}

// 清理仪表盘：停止定时器
function clearGaugeChart() {
  clearInterval(intervalId);
}

// 启动仪表盘定时更新
initGaugeChart();

// 组件卸载时清理定时器，避免内存泄漏
onUnmounted(() => {
  clearGaugeChart();
});
</script>

<template>
  <!-- ECharts 图表示例集合 -->
  <NSpace vertical :size="16">
    <!-- 饼图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="pieRef" class="h-400px" />
    </NCard>
    <!-- 折线图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="lineRef" class="h-400px" />
    </NCard>
    <!-- 柱状图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="barRef" class="h-400px" />
    </NCard>
    <!-- 雷达图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="radarRef" class="h-400px"></div>
    </NCard>
    <!-- 散点图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="scatterRef" class="h-600px"></div>
    </NCard>
    <!-- 象形柱图 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="pictorialBarRef" class="h-600px" />
    </NCard>
    <!-- 仪表盘 -->
    <NCard :bordered="false" class="card-wrapper">
      <div ref="gaugeRef" class="h-640px" />
    </NCard>
  </NSpace>
</template>

<style scoped></style>
