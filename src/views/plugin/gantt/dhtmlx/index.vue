<script setup lang="tsx">
import { onMounted, shallowRef } from 'vue';
import { gantt } from 'dhtmlx-gantt';
import type { GanttConfigOptions, ZoomLevel } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import { ganttTasks } from './data';

// dhtmlxGantt 示例：初始化甘特图并提供时间粒度（天/周/月/季/年）切换
const ganttRef = shallowRef<HTMLElement>();

// 时间粒度类型
type TimeType = 'day' | 'week' | 'month' | 'quarter' | 'year';

// 当前时间粒度
const timeType = shallowRef<TimeType>('quarter');

// 时间粒度 Tab 配置结构
interface TimeData {
  // 显示名称
  name: string;
  // 时间粒度 code
  code: TimeType;
  // TimeData 接口定义结束
}

// 时间粒度选项列表
const data: TimeData[] = [
  {
    name: '天',
    code: 'day'
  },
  {
    name: '周',
    code: 'week'
  },
  {
    name: '月',
    code: 'month'
  },
  {
    name: '季',
    code: 'quarter'
  },
  {
    name: '年',
    code: 'year'
  }
];

// 初始化甘特图（中文说明：设置 gantt.config、加载数据并初始化 zoom levels）
function initGantt() {
  if (!ganttRef.value) return;

  // 基础配置
  const config: Partial<GanttConfigOptions> = {
    grid_width: 350,
    add_column: false,
    autofit: false,
    row_height: 60,
    bar_height: 34,
    auto_types: true,
    xml_date: '%Y-%m-%d',
    columns: [
      {
        name: 'text',
        label: '项目名称',
        tree: true,
        width: '*'
      },
      {
        name: 'start_date',
        label: '开始时间',
        align: 'center',
        width: 150
      }
    ]
  };

  // 合并配置到 gantt.config
  Object.assign(gantt.config, config);

  // 设置中文语言包
  gantt.i18n.setLocale('cn');
  // 初始化甘特图容器
  gantt.init(ganttRef.value);
  // 解析并渲染任务数据
  gantt.parse({ data: ganttTasks });

  // 缩放等级配置（天/周/月/季/年）
  const zoomLevels: ZoomLevel[] = [
    {
      name: 'day',
      scale_height: 60,
      scales: [{ unit: 'day', step: 1, format: '%d %M' }]
    },
    {
      name: 'week',
      scale_height: 60,
      scales: [
        {
          unit: 'week',
          step: 1,
          format(date: Date) {
            const dateToStr = gantt.date.date_to_str('%m-%d');
            const endDate = gantt.date.add(date, -6, 'day'); // 第几周
            return `${dateToStr(endDate)} 至 ${dateToStr(date)}`;
          }
        },
        {
          unit: 'day',
          step: 1,
          format: '%d',
          css(date: Date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'day-item weekend weekend-border-bottom';
            }
            return 'day-item';
          }
        }
      ]
    },
    {
      name: 'month',
      scale_height: 60,
      min_column_width: 18,
      scales: [
        { unit: 'month', format: '%Y-%m' },
        {
          unit: 'day',
          step: 1,
          format: '%d',
          css(date: Date) {
            if (date.getDay() === 0 || date.getDay() === 6) {
              return 'day-item weekend weekend-border-bottom';
            }
            return 'day-item';
          }
        }
      ]
    },
    {
      name: 'quarter',
      height: 60,
      min_column_width: 110,
      scales: [
        {
          unit: 'quarter',
          step: 1,
          format(date: Date) {
            const yearStr = `${new Date(date).getFullYear()}年`;
            const dateToStr = gantt.date.date_to_str('%M');
            const endDate = gantt.date.add(gantt.date.add(date, 3, 'month'), -1, 'day');
            return `${yearStr + dateToStr(date)} - ${dateToStr(endDate)}`;
          }
        },
        {
          unit: 'week',
          step: 1,
          format(date: Date) {
            const dateToStr = gantt.date.date_to_str('%m-%d');
            const endDate = gantt.date.add(date, 6, 'day');
            return `${dateToStr(date)} 至 ${dateToStr(endDate)}`;
          }
        }
      ]
    },
    {
      name: 'year',
      scale_height: 50,
      min_column_width: 150,
      scales: [
        { unit: 'year', step: 1, format: '%Y年' },
        { unit: 'month', format: '%Y-%m' }
      ]
    }
  ];

  // 初始化 zoom 扩展并设置默认缩放等级
  gantt.ext.zoom.init({
    levels: zoomLevels
  });
  gantt.ext.zoom.setLevel(timeType.value);
}

// 切换时间粒度（中文说明：更新 timeType 并调用 zoom.setLevel）
function changeTime(value: TimeType) {
  timeType.value = value;
  gantt.ext.zoom.setLevel(value);
}

// 组件挂载后初始化甘特图
onMounted(() => {
  initGantt();
});
</script>

<template>
  <!-- 甘特图演示页：dhtmlxGantt 示例 -->
  <div class="overflow-hidden lt-sm:overflow-auto">
    <NCard
      title="甘特图演示"
      :bordered="false"
      size="small"
      content-class="overflow-y-hidden overflow-x-auto"
      class="h-full card-wrapper"
    >
      <template #header-extra>
        <!-- 时间粒度切换 Tabs -->
        <NTabs
          :value="timeType"
          type="segment"
          animated
          size="small"
          class="relative w-320px"
          @update:value="changeTime"
        >
          <NTab v-for="item in data" :key="item.code" :name="item.code">
            {{ item.name }}
          </NTab>
        </NTabs>
      </template>

      <!-- 甘特图容器 -->
      <div ref="ganttRef" class="size-full min-w-800px"></div>
    </NCard>
  </div>
</template>

<style scoped lang="scss"></style>
