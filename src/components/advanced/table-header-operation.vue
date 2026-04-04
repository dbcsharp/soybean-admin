<script setup lang="ts">
import { $t } from '@/locales';

// 组件选项：设置组件名称（便于 Devtools 调试）
defineOptions({
  name: 'TableHeaderOperation'
});

// 组件 Props：对齐方式/批量删除禁用/刷新 loading
interface Props {
  itemAlign?: NaiveUI.Align;
  disabledDelete?: boolean;
  loading?: boolean;
}

// 声明 props
defineProps<Props>();

// 组件事件：新增/删除/刷新
interface Emits {
  (e: 'add'): void;
  (e: 'delete'): void;
  (e: 'refresh'): void;
}

// 声明 emits
const emit = defineEmits<Emits>();

// 列设置（v-model:columns）：由 TableColumnSetting 维护 checked/visible/fixed
const columns = defineModel<NaiveUI.TableColumnCheck[]>('columns', {
  default: () => []
});

// 触发新增
function add() {
  emit('add');
}

// 触发批量删除
function batchDelete() {
  emit('delete');
}

// 触发刷新
function refresh() {
  emit('refresh');
}
</script>

<template>
  <!-- 表格头部操作区：支持插槽扩展 + 默认新增/批删/刷新 + 列设置 -->
  <NSpace :align="itemAlign" wrap justify="end" class="lt-sm:w-200px">
    <slot name="prefix"></slot>
    <slot name="default">
      <!-- 新增 -->
      <NButton size="small" ghost type="primary" @click="add">
        <template #icon>
          <icon-ic-round-plus class="text-icon" />
        </template>
        {{ $t('common.add') }}
      </NButton>
      <!-- 批量删除（带确认） -->
      <NPopconfirm @positive-click="batchDelete">
        <template #trigger>
          <NButton size="small" ghost type="error" :disabled="disabledDelete">
            <template #icon>
              <icon-ic-round-delete class="text-icon" />
            </template>
            {{ $t('common.batchDelete') }}
          </NButton>
        </template>
        {{ $t('common.confirmDelete') }}
      </NPopconfirm>
    </slot>
    <!-- 刷新 -->
    <NButton size="small" @click="refresh">
      <template #icon>
        <icon-mdi-refresh class="text-icon" :class="{ 'animate-spin': loading }" />
      </template>
      {{ $t('common.refresh') }}
    </NButton>
    <!-- 列设置 -->
    <TableColumnSetting v-model:columns="columns" />
    <slot name="suffix"></slot>
  </NSpace>
</template>

<style scoped></style>
