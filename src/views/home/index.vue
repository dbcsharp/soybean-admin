<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import HeaderBanner from './modules/header-banner.vue';
import CardData from './modules/card-data.vue';
import LineChart from './modules/line-chart.vue';
import PieChart from './modules/pie-chart.vue';
import ProjectNews from './modules/project-news.vue';
import CreativityBanner from './modules/creativity-banner.vue';

// 获取应用状态（用于判断移动端并调整栅格间距）
const appStore = useAppStore();

// 栅格间距：移动端不留横向间距，非移动端使用 16
const gap = computed(() => (appStore.isMobile ? 0 : 16));
</script>

<template>
  <!-- 首页：顶部 Banner、统计卡片、图表与项目动态等模块 -->
  <NSpace vertical :size="16">
    <!-- 头部欢迎 Banner -->
    <HeaderBanner />
    <!-- 数据统计卡片 -->
    <CardData />
    <!-- 图表区域：折线图 + 饼图 -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <!-- 折线图 -->
      <NGi span="24 s:24 m:14">
        <NCard :bordered="false" class="card-wrapper">
          <LineChart />
        </NCard>
      </NGi>
      <!-- 饼图 -->
      <NGi span="24 s:24 m:10">
        <NCard :bordered="false" class="card-wrapper">
          <PieChart />
        </NCard>
      </NGi>
    </NGrid>
    <!-- 下方区域：项目动态 + 创意 Banner -->
    <NGrid :x-gap="gap" :y-gap="16" responsive="screen" item-responsive>
      <!-- 项目动态 -->
      <NGi span="24 s:24 m:14">
        <ProjectNews />
      </NGi>
      <!-- 创意 Banner -->
      <NGi span="24 s:24 m:10">
        <CreativityBanner />
      </NGi>
    </NGrid>
  </NSpace>
</template>

<style scoped></style>
