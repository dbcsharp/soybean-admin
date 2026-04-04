<script setup lang="ts">
import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'PieChart'
});

// 获取应用状态（用于监听语言变化）
const appStore = useAppStore();

// 初始化 ECharts（通过 useEcharts 创建实例，并提供 domRef 与 updateOptions）
const { domRef, updateOptions } = useEcharts(() => ({
  // tooltip 配置：项触发
  tooltip: {
    trigger: 'item'
  },
  // legend 配置：底部居中
  legend: {
    bottom: '1%',
    left: 'center',
    itemStyle: {
      borderWidth: 0
    }
  },
  // series：环形饼图
  series: [
    {
      color: ['#5da8ff', '#8e9dff', '#fedc69', '#26deca'],
      name: $t('page.home.schedule'),
      type: 'pie',
      radius: ['45%', '75%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 1
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '12'
        }
      },
      labelLine: {
        show: false
      },
      data: [] as { name: string; value: number }[]
    }
  ]
}));

// 模拟接口数据（延迟 1s 后写入饼图数据）
async function mockData() {
  // 模拟请求耗时
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  // 更新图表数据
  updateOptions(opts => {
    // 写入数据：学习/娱乐/工作/休息
    opts.series[0].data = [
      { name: $t('page.home.study'), value: 20 },
      { name: $t('page.home.entertainment'), value: 10 },
      { name: $t('page.home.work'), value: 40 },
      { name: $t('page.home.rest'), value: 30 }
    ];

    // 返回更新后的 opts
    return opts;
  });
}

// 更新语言相关的图例名称与数据 label（语言切换时重写 series.name 与 data.name）
function updateLocale() {
  updateOptions((opts, factory) => {
    // 重新生成一份“原始配置”（带最新 i18n 文案）
    const originOpts = factory();

    // 同步系列名称
    opts.series[0].name = originOpts.series[0].name;

    // 重新写入数据名称（使用最新 i18n 文案）
    opts.series[0].data = [
      { name: $t('page.home.study'), value: 20 },
      { name: $t('page.home.entertainment'), value: 10 },
      { name: $t('page.home.work'), value: 40 },
      { name: $t('page.home.rest'), value: 30 }
    ];

    // 返回更新后的 opts
    return opts;
  });
}

// 初始化（加载模拟数据）
async function init() {
  // 拉取并写入数据
  mockData();
}

// 监听语言变化：更新图表文案
watch(
  () => appStore.locale,
  () => {
    updateLocale();
  }
);

// init
// 执行初始化
init();
</script>

<template>
  <!-- 饼图卡片 -->
  <NCard :bordered="false" class="card-wrapper">
    <!-- 图表容器：由 useEcharts 绑定到 domRef -->
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
