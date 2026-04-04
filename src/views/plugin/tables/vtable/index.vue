<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import {
  Group,
  Image,
  ListColumn,
  ListTable,
  Menu,
  PivotChart,
  PivotColumnDimension,
  PivotCorner,
  PivotIndicator,
  PivotRowDimension,
  PivotTable,
  Tag,
  Text,
  VTable,
  registerChartModule
} from '@visactor/vue-vtable';
import VChart from '@visactor/vchart';
import { useThemeStore } from '@/store/modules/theme';
import { customListRecords, listTableRecords, pivotChartColumns, pivotChartIndicators, pivotChartRows } from './data';

// Vue-VTable 示例页：ListTable / GroupTable / PivotTable / PivotChart 与自定义渲染单元格示例
// 注册 vchart 图表模块（用于 PivotChart 渲染）
registerChartModule('vchart', VChart);
// 分组标题背景色池（用于 groupTitleStyle）
const titleColorPool = ['#3370ff', '#34c724', '#ff9f1a', '#ff4050', '#1f2329'];

// 获取主题状态（用于切换 VTable 主题）
const themeStore = useThemeStore();

// list table
// 普通列表表格引用
const listTableRef = ref(null);
// 列表表格配置（根据暗黑模式切换主题）
const listOptions = computed(() => {
  const options = {
    theme: themeStore.darkMode ? VTable.themes.DARK : VTable.themes.DEFAULT
  };
  return options;
});
// 列表表格数据
const listRecords = ref<Record<string, string | number>[]>(listTableRecords);

// group table
// 分组表格引用
const groupTableRef = ref(null);
// 分组表格配置（按 Category/Sub-Category 分组，并自定义分组标题背景色）
const groupOptions = computed(() => {
  const options = {
    groupBy: ['Category', 'Sub-Category'],
    theme: (themeStore.darkMode ? VTable.themes.DARK : VTable.themes.DEFAULT).extends({
      groupTitleStyle: {
        fontWeight: 'bold',
        bgColor: (args: any) => {
          const { col, row, table } = args;
          const index = table.getGroupTitleLevel(col, row);
          if (index !== undefined) {
            return titleColorPool[index % titleColorPool.length] as string;
          }
          return 'white';
        }
      }
    })
  };
  return options;
});
const groupRecords = ref<Record<string, string | number>[]>(listTableRecords);

// pivot table
// 透视表引用
const pivotTableRef = ref(null);
// 透视表配置（tooltip/排序规则/主题/空提示）
const pivotTableOptions = computed(() => {
  return {
    tooltip: {
      isShowOverflowTextTooltip: true
    },
    dataConfig: {
      sortRules: [
        {
          sortField: 'Category',
          sortBy: ['Office Supplies', 'Technology', 'Furniture']
        }
      ]
    },
    widthMode: 'standard',
    theme: themeStore.darkMode ? VTable.themes.DARK : VTable.themes.DEFAULT,
    emptyTip: {
      text: 'no data records'
    }
  };
});
// 透视表指标定义
const pivotTableIndicators = ref([
  {
    indicatorKey: 'Quantity',
    title: 'Quantity',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  },
  {
    indicatorKey: 'Sales',
    title: 'Sales',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: (rec: string) => `$${Number(rec).toFixed(2)}`,
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  },
  {
    indicatorKey: 'Profit',
    title: 'Profit',
    width: 'auto',
    showSort: false,
    headerStyle: { fontWeight: 'normal' },
    format: (rec: string) => `$${Number(rec).toFixed(2)}`,
    style: {
      padding: [16, 28, 16, 28],
      color(args: any) {
        return args.dataValue >= 0 ? 'black' : 'red';
      }
    }
  }
]);
// 透视表行维度定义
const pivotTableRows = ref([
  {
    dimensionKey: 'City',
    title: 'City',
    headerStyle: { textStick: true },
    width: 'auto'
  }
]);
// 透视表数据（mounted 时通过 fetch 异步加载）
const pivotTableRecords = ref([]);

// pivot chart
// 透视图表引用
const pivotChartRef = ref(null);
// 透视图表配置（包含 rows/columns/indicators/legend/theme 等）
const pivotChartOptions = computed(() => {
  return {
    rows: pivotChartRows,
    columns: pivotChartColumns,
    indicators: pivotChartIndicators,
    indicatorsAsCol: false,
    defaultRowHeight: 200,
    defaultHeaderRowHeight: 50,
    defaultColWidth: 280,
    defaultHeaderColWidth: 100,
    indicatorTitle: '指标',
    autoWrapText: true,
    corner: {
      titleOnDimension: 'row',
      headerStyle: { autoWrapText: true }
    },
    legends: {
      orient: 'bottom',
      type: 'discrete',
      data: [
        { label: 'Consumer-Quantity', shape: { fill: '#2E62F1', symbolType: 'circle' } },
        { label: 'Consumer-Quantity', shape: { fill: '#4DC36A', symbolType: 'square' } },
        { label: 'Home Office-Quantity', shape: { fill: '#FF8406', symbolType: 'square' } },
        { label: 'Consumer-Sales', shape: { fill: '#FFCC00', symbolType: 'square' } },
        { label: 'Consumer-Sales', shape: { fill: '#4F44CF', symbolType: 'square' } },
        { label: 'Home Office-Sales', shape: { fill: '#5AC8FA', symbolType: 'square' } },
        { label: 'Consumer-Profit', shape: { fill: '#003A8C', symbolType: 'square' } },
        { label: 'Consumer-Profit', shape: { fill: '#B08AE2', symbolType: 'square' } },
        { label: 'Home Office-Profit', shape: { fill: '#FF6341', symbolType: 'square' } }
      ]
    },
    theme: (themeStore.darkMode ? VTable.themes.DARK : VTable.themes.DEFAULT).extends({
      bodyStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 0, 1] },
      headerStyle: { borderColor: 'gray', borderLineWidth: [0, 0, 1, 1], hover: { cellBgColor: '#CCE0FF' } },
      rowHeaderStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 0], hover: { cellBgColor: '#CCE0FF' } },
      cornerHeaderStyle: { borderColor: 'gray', borderLineWidth: [0, 1, 1, 0], hover: { cellBgColor: '' } },
      cornerRightTopCellStyle: { borderColor: 'gray', borderLineWidth: [0, 0, 1, 1], hover: { cellBgColor: '' } },
      cornerLeftBottomCellStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 0], hover: { cellBgColor: '' } },
      cornerRightBottomCellStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 0, 1], hover: { cellBgColor: '' } },
      rightFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 0, 1, 1], hover: { cellBgColor: '' } },
      bottomFrozenStyle: { borderColor: 'gray', borderLineWidth: [1, 1, 0, 1], hover: { cellBgColor: '' } },
      selectionStyle: { cellBgColor: '', cellBorderColor: '' },
      frameStyle: { borderLineWidth: 0 }
    }),
    emptyTip: {
      text: 'no data records'
    }
  };
});
// 透视图表数据（mounted 时通过 fetch 异步加载）
const pivotChartRecords = ref({} as any);
// 图例点击处理（通过 updateFilterRules 过滤 Segment-Indicator）
const handleLegendItemClick = (args: { value: any }) => {
  (pivotChartRef?.value as any)?.vTableInstance.updateFilterRules([
    {
      filterKey: 'Segment-Indicator',
      filteredValues: args.value
    }
  ]);
};

// custom layout list table
// 自定义渲染列表表引用
const customLayoutListTableRef = ref(null);
// 自定义渲染列表表配置（默认行高/主题）
const customLayoutListTableOptions = computed(() => {
  return {
    defaultRowHeight: 80,
    theme: themeStore.darkMode ? VTable.themes.DARK : VTable.themes.DEFAULT
  };
});
// 自定义渲染列表数据
const customLayoutListTableRecords = ref(customListRecords);
// 自定义列样式
const customLayoutListTableColumnStyle = ref({ fontFamily: 'Arial', fontSize: 12, fontWeight: 'bold' });

onMounted(() => {
  // pivot tablt records
  // 拉取透视表数据
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_data.json')
    .then(res => res.json())
    .then(jsonData => {
      // update record
      pivotTableRecords.value = jsonData;
    });

  // pivot chart records
  // 拉取透视图表数据
  fetch('https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/North_American_Superstore_Pivot_Chart_data.json')
    .then(res => res.json())
    .then(data => {
      // update record
      pivotChartRecords.value = data;
    });
});
</script>

<template>
  <div class="h-full">
    <NSpace vertical :size="16">
      <NCard title="List Table" :bordered="false" class="h-full w-2/3 card-wrapper">
        <ListTable ref="listTableRef" :options="listOptions" :records="listRecords" height="400px">
          <ListColumn field="Order ID" title="Order ID" width="auto" />
          <ListColumn field="Customer ID" title="Customer ID" width="auto" />
          <ListColumn field="Product Name" title="Product Name" width="auto" />
          <ListColumn field="Category" title="Category" width="auto" />
          <ListColumn field="Sub-Category" title="Sub-Category" width="auto" />
          <ListColumn field="Region" title="Region" width="auto" />
          <ListColumn field="City" title="City" width="auto" />
          <ListColumn field="Order Date" title="Order Date" width="auto" />
          <ListColumn field="Quantity" title="Quantity" width="auto" />
          <ListColumn field="Sales" title="Sales" width="auto" />
          <ListColumn field="Profit" title="Profit" width="auto" />
        </ListTable>
      </NCard>

      <NCard title="Group Table" :bordered="false" class="h-full w-2/3 card-wrapper">
        <ListTable ref="groupTableRef" :options="groupOptions" :records="groupRecords" height="400px">
          <ListColumn field="Order ID" title="Order ID" width="auto" />
          <ListColumn field="Customer ID" title="Customer ID" width="auto" />
          <ListColumn field="Product Name" title="Product Name" width="auto" />
          <ListColumn field="Category" title="Category" width="auto" />
          <ListColumn field="Sub-Category" title="Sub-Category" width="auto" />
          <ListColumn field="Region" title="Region" width="auto" />
          <ListColumn field="City" title="City" width="auto" />
          <ListColumn field="Order Date" title="Order Date" width="auto" />
          <ListColumn field="Quantity" title="Quantity" width="auto" />
          <ListColumn field="Sales" title="Sales" width="auto" />
          <ListColumn field="Profit" title="Profit" width="auto" />
        </ListTable>
      </NCard>

      <NCard title="Pivot Table" :bordered="false" class="h-full w-2/3 card-wrapper">
        <PivotTable ref="pivotTableRef" :options="pivotTableOptions" :records="pivotTableRecords" height="400px">
          <PivotColumnDimension
            title="Category"
            dimension-key="Category"
            :header-style="{ textStick: true }"
            width="auto"
          />
          <PivotRowDimension
            v-for="(row, index) in pivotTableRows"
            :key="index"
            :dimension-key="row.dimensionKey"
            :title="row.title"
            :header-style="row.headerStyle"
            :width="row.width"
          />
          <PivotIndicator
            v-for="(indicator, index) in pivotTableIndicators"
            :key="index"
            :indicator-key="indicator.indicatorKey"
            :title="indicator.title"
            :width="indicator.width"
            :show-sort="indicator.showSort"
            :header-style="indicator.headerStyle"
            :format="indicator.format"
            :style="indicator.style"
          />
          <PivotCorner title-on-dimension="row" />
          <Menu menu-type="html" :context-menu-items="['copy', 'paste', 'delete', '...']" />
        </PivotTable>
      </NCard>

      <NCard title="Pivot Chart" :bordered="false" class="h-full w-2/3 card-wrapper">
        <PivotChart
          ref="pivotChartRef"
          :options="pivotChartOptions"
          :records="pivotChartRecords"
          height="800px"
          @on-legend-item-click="handleLegendItemClick"
        />
      </NCard>

      <NCard title="Custom Component" :bordered="false" class="h-full w-2/3 card-wrapper">
        <ListTable
          ref="customLayoutListTableRef"
          :options="customLayoutListTableOptions"
          :records="customLayoutListTableRecords"
          height="400px"
        >
          <!-- Order Number Column -->
          <ListColumn field="bloggerId" title="Order Number" width="100" />

          <!-- Anchor Nickname Column with Custom Layout -->
          <ListColumn field="bloggerName" title="Anchor Nickname" :width="330">
            <template #customLayout="{ record, height, width }">
              <Group :height="height" :width="width" display="flex" flex-direction="row" flex-wrap="nowrap">
                <!-- Avatar Group -->
                <Group
                  :height="height"
                  :width="60"
                  display="flex"
                  flex-direction="column"
                  align-items="center"
                  justify-content="space-around"
                  fill="red"
                  :opacity="0.1"
                >
                  <Image id="icon0" :width="50" :height="50" :image="record.bloggerAvatar" :corner-radius="25" />
                </Group>
                <!-- Blogger Info Group -->
                <Group :height="height" :width="width - 60" display="flex" flex-direction="column" flex-wrap="nowrap">
                  <Group
                    :height="height / 2"
                    :width="width - 60"
                    display="flex"
                    flex-wrap="wrap"
                    align-items="center"
                    fill="orange"
                    :opacity="0.1"
                  >
                    <Text
                      :text="record.bloggerName"
                      :font-size="13"
                      font-family="sans-serif"
                      fill="black"
                      :bounds-padding="[0, 0, 0, 10]"
                    />
                    <Image
                      id="location"
                      image="https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/location.svg"
                      :width="15"
                      :height="15"
                      :bounds-padding="[0, 0, 0, 10]"
                      cursor="pointer"
                    />
                    <Text :text="record.city" :font-size="11" font-family="sans-serif" fill="#6f7070" />
                  </Group>
                  <!-- Tags Group -->
                  <Group
                    :height="height / 2"
                    :width="width - 60"
                    display="flex"
                    align-items="center"
                    fill="yellow"
                    :opacity="0.1"
                  >
                    <Tag
                      v-for="tag in record?.tags"
                      :key="tag"
                      :text="tag"
                      :text-style="{ fontSize: 10, fontFamily: 'sans-serif', fill: 'rgb(51, 101, 238)' }"
                      :panel="{ visible: true, fill: '#f4f4f2', cornerRadius: 5 }"
                      :space="5"
                      :bounds-padding="[0, 0, 0, 5]"
                    />
                  </Group>
                </Group>
              </Group>
            </template>
          </ListColumn>

          <!-- Other Columns -->
          <ListColumn
            field="fansCount"
            title="Fans Count"
            width="120"
            :field-format="rec => rec.fansCount + 'w'"
            :style="customLayoutListTableColumnStyle"
          />
          <ListColumn field="worksCount" title="Works Count" :style="customLayoutListTableColumnStyle" width="135" />
          <ListColumn
            field="viewCount"
            title="View Count"
            width="120"
            :field-format="rec => rec.viewCount + 'w'"
            :style="customLayoutListTableColumnStyle"
          />
        </ListTable>
      </NCard>

      <NCard :bordered="false" class="h-full w-2/3 card-wrapper">
        <WebSiteLink label="More VTable Demos: " link="https://www.visactor.com/vtable/example" />
      </NCard>
    </NSpace>
  </div>
</template>
