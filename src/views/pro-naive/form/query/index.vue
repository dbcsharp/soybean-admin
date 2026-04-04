<script setup lang="ts">
import { computed, ref } from 'vue';
import { useMessage } from 'naive-ui';
import type { ProSearchFormColumns } from 'pro-naive-ui';
import { createProSearchForm } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

// 查询表单数据结构（中文说明：用于示例字段定义）
interface Info {
  appName: string;
  appStatus: string;
  createTime: number;
  responseDate: number;
  endTime: number;
}

// 第一个搜索表单 loading
const loading = ref(false);
// 第二个搜索表单 loading
const loading2 = ref(false);
// Naive UI message 实例
const message = useMessage();

// 搜索表单实例 1（中文说明：基础示例）
const form = createProSearchForm<Partial<Info>>({
  onReset: () => {
    message.success('reset success');
  },
  onSubmit: async values => {
    message.success(JSON.stringify(values));
    loading.value = true;
    await delay(1500);
    loading.value = false;
  }
});

// 搜索表单实例 2（中文说明：默认折叠 + 更多字段）
const form2 = createProSearchForm<Partial<Info>>({
  defaultCollapsed: true,
  onReset: () => {
    message.success('reset success');
  },
  onSubmit: async values => {
    message.success(JSON.stringify(values));
    loading2.value = true;
    await delay(1500);
    loading2.value = false;
  }
});

// 搜索列配置 1（中文说明：常见输入/日期/日期时间字段）
const columns = computed<ProSearchFormColumns<Info>>(() => {
  return [
    {
      title: $t('page.proNaive.form.query.appName'),
      path: 'appName'
    },
    {
      title: $t('page.proNaive.form.query.createTime'),
      path: 'createTime',
      field: 'date'
    },
    {
      title: $t('page.proNaive.form.query.appStatus'),
      path: 'appStatus'
    },
    {
      title: $t('page.proNaive.form.query.responseDate'),
      path: 'responseDate',
      field: 'date-time'
    },
    {
      title: $t('page.proNaive.form.query.endDate'),
      path: 'endTime',
      field: 'date'
    }
  ];
});

// 搜索列配置 2（中文说明：批量生成 20 个字段）
const columns2 = computed(() => {
  return Array.from({ length: 20 }, (_, i) => ({
    title: `${$t('page.proNaive.form.query.field')}${i}`,
    path: `field${i}`
  }));
});

// 延迟工具（中文说明：模拟请求耗时）
function delay(time: number) {
  return new Promise<void>(resolve => {
    setTimeout(resolve, time);
  });
}
</script>

<template>
  <!-- ProNaiveUI 查询表单示例：基础查询 + 折叠查询 -->
  <ConfigProvider>
    <div class="bg-#fff">
      <ProCard :title="$t('page.proNaive.form.query.title1')" :show-collapse="false">
        <!-- 基础查询表单 -->
        <ProSearchForm :form="form" :loading="loading" :columns="columns" />
      </ProCard>
      <ProCard class="mt-12px" :title="$t('page.proNaive.form.query.title2')" :show-collapse="false">
        <!-- 折叠查询表单：collapsed-rows 控制折叠行数 -->
        <ProSearchForm :form="form2" :loading="loading2" :columns="columns2" :collapsed-rows="2" />
      </ProCard>
    </div>
  </ConfigProvider>
</template>
