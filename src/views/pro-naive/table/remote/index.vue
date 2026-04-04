<script setup lang="ts">
import { computed } from 'vue';
import type { ProDataTableColumns, ProSearchFormColumns } from 'pro-naive-ui';
import {
  createProSearchForm,
  renderProCopyableText,
  renderProDateText,
  renderProImages,
  renderProTags,
  useNDataTable
} from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

// 模拟远程列表请求（中文说明：根据分页/筛选/排序参数与表单 values 返回数据）
function fetchList(params: any, values: any) {
  console.log(params, values);
  return new Promise<{ total: number; list: any[] }>(resolve => {
    setTimeout(() => {
      resolve({
        total: 987,
        list: [
          {
            now: Date.now(),
            src: 'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
            no: '3',
            title: 'Wonderwall',
            length: '4:18'
          },
          { now: Date.now(), src: '', no: '', title: "Don't Look Back in Anger", length: '4:48' },
          { now: Date.now(), src: undefined, no: '12', title: 'Champagne Supernova', length: '7:27' },
          { now: Date.now(), src: null, no: '33', title: 'Wonderwall', length: '4:18' },
          { now: Date.now(), src: [], no: '44', title: "Don't Look Back in Anger", length: '4:48' },
          {
            now: Date.now(),
            src: [
              'https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg',
              'https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg'
            ],
            no: '122',
            title: 'Champagne Supernova',
            length: '7:27'
          },
          { now: Date.now(), src: '', no: '333', title: 'Wonderwall', length: '4:18' },
          { now: Date.now(), src: '', no: '4444', title: "Don't Look Back in Anger", length: '4:48' },
          { now: Date.now(), src: '', no: '1222', title: 'Champagne Supernova', length: '7:27' },
          { now: Date.now(), src: '', no: '33333', title: 'Wonderwall', length: '4:18' }
        ]
      });
    }, 1500);
  });
}

// 表格列配置（中文说明：复制文本/标签/日期格式化/图片展示）
const columns = computed<ProDataTableColumns<{ src: any; title: string; now: number }>>(() => {
  return [
    {
      title: $t('page.proNaive.table.remote.replicableText'),
      render: row => renderProCopyableText(row.title)
    },
    {
      title: $t('page.proNaive.table.remote.tags'),
      render: row => renderProTags(row.title)
    },
    {
      title: $t('page.proNaive.table.remote.dateFormatting'),
      render: row =>
        renderProDateText(row.now, {
          pattern: 'quarter'
        })
    },
    {
      title: $t('page.proNaive.table.remote.image'),
      width: 200,
      render: row => renderProImages(row.src)
    }
  ];
});

// 搜索表单列配置（中文说明：用于 ProSearchForm 渲染筛选条件）
const searchColumns = computed<
  ProSearchFormColumns<{
    name: string;
    endTime: number;
    createTime: number;
    responseTime: number;
  }>
>(() => {
  return [
    {
      title: $t('page.proNaive.table.remote.name'),
      path: 'name'
    },
    {
      title: $t('page.proNaive.table.remote.createTime'),
      path: 'createTime',
      field: 'date'
    },
    {
      title: $t('page.proNaive.table.remote.responseTime'),
      path: 'responseTime',
      field: 'date'
    },
    {
      title: $t('page.proNaive.table.remote.responseTime'),
      path: 'responseTime',
      field: 'date'
    }
  ];
});

// 搜索表单实例（中文说明：设置初始值）
const searchForm = createProSearchForm({
  initialValues: {
    responseTime: Date.now()
  }
});

// useNDataTable：将 ProSearchForm 与 ProDataTable 做远程联动（中文说明：tableProps/proSearchFormProps）
const {
  table: { tableProps },
  search: { proSearchFormProps }
} = useNDataTable(
  ({ current, pageSize, filters, sorter }, values) => fetchList({ current, pageSize, filters, sorter }, values),
  {
    form: searchForm
  }
);
</script>

<template>
  <!-- ProNaiveUI 远程表格示例：查询表单 + 远程分页表格 -->
  <ConfigProvider>
    <div class="h-full flex flex-col">
      <ProCard :title="$t('page.proNaive.table.remote.filterCondition')" class="mb-24px" :show-collapse="false">
        <!-- 查询条件表单 -->
        <ProSearchForm :form="searchForm" label-placement="left" :columns="searchColumns" v-bind="proSearchFormProps" />
      </ProCard>
      <!-- 远程表格：flex-height 适配容器高度 -->
      <ProDataTable
        :title="$t('page.proNaive.table.remote.title')"
        size="small"
        flex-height
        :columns="columns"
        row-key="no"
        v-bind="tableProps"
      />
    </div>
  </ConfigProvider>
</template>
