<script setup lang="ts">
import { watch } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'LineChart'
});

// 获取应用状态（用于监听语言变化）
const appStore = useAppStore();

// 初始化 ECharts（中文说明：通过 useEcharts 创建实例，并提供 domRef 与 updateOptions）
const { domRef, updateOptions } = useEcharts(() => ({
  // tooltip 配置：轴触发 + 十字指示器
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: '#6a7985'
      }
    }
  },
  // legend 配置：显示两条折线的图例
  legend: {
    data: [$t('page.home.downloadCount'), $t('page.home.registerCount')],
    top: '0'
  },
  // grid 配置：图表四周边距
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '15%'
  },
  // x 轴：类目轴（时间点）
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: [] as string[]
  },
  // y 轴：数值轴
  yAxis: {
    type: 'value'
  },
  // series：两条折线（下载量/注册量），带渐变面积
  series: [
    {
      color: '#8e9dff',
      name: $t('page.home.downloadCount'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#8e9dff'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: [] as number[]
    },
    {
      color: '#26deca',
      name: $t('page.home.registerCount'),
      type: 'line',
      smooth: true,
      stack: 'Total',
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0.25,
              color: '#26deca'
            },
            {
              offset: 1,
              color: '#fff'
            }
          ]
        }
      },
      emphasis: {
        focus: 'series'
      },
      data: []
    }
  ]
}));

// 模拟接口数据（中文说明：延迟 1s 后写入折线数据）
async function mockData() {
  // 模拟请求耗时
  await new Promise(resolve => {
    setTimeout(resolve, 1000);
  });

  // 更新图表数据
  updateOptions(opts => {
    // x 轴类目（时间点）
    opts.xAxis.data = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
    // 下载量数据
    opts.series[0].data = [4623, 6145, 6268, 6411, 1890, 4251, 2978, 3880, 3606, 4311];
    // 注册量数据
    opts.series[1].data = [2208, 2016, 2916, 4512, 8281, 2008, 1963, 2367, 2956, 678];

    // 返回更新后的 opts
    return opts;
  });
  // mockData 函数结束
}

// 更新语言相关的图例/系列名称（中文说明：语言切换时重新生成原始配置并同步名称）
function updateLocale() {
  updateOptions((opts, factory) => {
    // 重新生成一份“原始配置”（带最新 i18n 文案）
    const originOpts = factory();

    // 同步图例数据
    opts.legend.data = originOpts.legend.data;
    // 同步第一条系列名称
    opts.series[0].name = originOpts.series[0].name;
    // 同步第二条系列名称
    opts.series[1].name = originOpts.series[1].name;

    // 返回更新后的 opts
    return opts;
  });
  // updateLocale 函数结束
}

// 初始化（中文说明：加载模拟数据）
async function init() {
  // 拉取并写入数据
  mockData();
  // init 函数结束
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
  <!-- 折线图卡片 -->
  <NCard :bordered="false" class="card-wrapper">
    <!-- 图表容器：由 useEcharts 绑定到 domRef -->
    <div ref="domRef" class="h-360px overflow-hidden"></div>
  </NCard>
</template>

<style scoped></style>
