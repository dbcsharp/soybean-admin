<script setup lang="tsx">
import { computed, ref } from 'vue';
import { NButton, NFlex, useMessage } from 'naive-ui';
import type { ProEditDataTableColumns } from 'pro-naive-ui';
import { createProForm } from 'pro-naive-ui';
import { $t } from '@/locales';
import ConfigProvider from '../../ConfigProvider.vue';

// 数据源行结构（用于可编辑表格示例）
interface DataSourceType {
  id: string;
  title?: string;
  now?: number;
  rate?: number;
}

// Naive UI message 实例
const message = useMessage();
// 当前处于编辑态的行 id 列表
const editableKeys = ref<string[]>([]);

// ProForm 实例（表格作为表单字段 list，通过 submit 获取整表数据）
const form = createProForm({
  initialValues: {
    list: [
      {
        id: '1',
        now: Date.now(),
        rate: 4,
        title: `${$t('page.proNaive.table.rowEdit.task')}1`
      },
      {
        id: '2',
        now: Date.now(),
        rate: 3,
        title: `${$t('page.proNaive.table.rowEdit.task')}2`
      },
      {
        id: '3',
        now: Date.now(),
        rate: 5,
        title: `${$t('page.proNaive.table.rowEdit.task')}3`
      }
    ]
  },
  onSubmit: values => {
    message.success(JSON.stringify(values));
  }
});

// 取消某行编辑态（从 editableKeys 中移除该 id）
function cancelEditable(id: string) {
  editableKeys.value = editableKeys.value.filter(key => key !== id);
}

// 可编辑表格列配置（输入/日期时间/评分 + 操作列）
const columns = computed<ProEditDataTableColumns<DataSourceType>>(() => {
  return [
    {
      title: $t('page.proNaive.table.rowEdit.name'),
      path: 'title',
      field: 'input',
      width: 200
    },
    {
      title: $t('page.proNaive.table.rowEdit.time'),
      path: 'now',
      field: 'date-time',
      width: 200
    },
    {
      title: $t('page.proNaive.table.rowEdit.score'),
      path: 'rate',
      field: 'rate'
    },
    {
      title: $t('page.proNaive.table.rowEdit.action'),
      width: 120,
      fixed: 'right',
      render: (row, rowIndex, { remove, editable }) => {
        return (
          <NFlex>
            {editable ? (
              <NButton text={true} type="primary" onClick={() => cancelEditable(row.id)}>
                {$t('page.proNaive.table.rowEdit.save')}
              </NButton>
            ) : (
              [
                <NButton text={true} type="primary" onClick={() => editableKeys.value.push(row.id)}>
                  {$t('page.proNaive.table.rowEdit.edit')}
                </NButton>,
                <NButton
                  text={true}
                  type="error"
                  onClick={() => {
                    remove(rowIndex);
                    cancelEditable(row.id);
                  }}
                >
                  {$t('page.proNaive.table.rowEdit.delete')}
                </NButton>
              ]
            )}
          </NFlex>
        );
      }
    }
  ];
});
</script>

<template>
  <!-- ProNaiveUI 行编辑表格示例：ProEditDataTable 作为表单字段 -->
  <ConfigProvider>
    <ProForm :form="form" label-placement="left">
      <!-- ProConfigProvider：统一关闭表单项反馈提示 -->
      <ProConfigProvider
        :prop-overrides="{
          ProFormItem: {
            showFeedback: false
          }
        }"
      >
        <!-- 可编辑表格：v-model:editable-keys 控制编辑行 -->
        <ProEditDataTable
          v-model:editable-keys="editableKeys"
          path="list"
          :columns="columns"
          :record-creator-props="{
            record: () => ({ id: Date.now() })
          }"
          row-key="id"
          :field-props="{
            title: $t('page.proNaive.table.rowEdit.title')
          }"
        >
          <template #toolbar>
            <!-- 工具栏：重置/提交 -->
            <NFlex>
              <NButton attr-type="reset">{{ $t('page.proNaive.table.rowEdit.reset') }}</NButton>
              <NButton type="primary" attr-type="submit">{{ $t('page.proNaive.table.rowEdit.submit') }}</NButton>
            </NFlex>
          </template>
        </ProEditDataTable>
      </ProConfigProvider>
    </ProForm>
  </ConfigProvider>
</template>
