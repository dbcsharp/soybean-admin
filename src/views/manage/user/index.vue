<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetUserList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import UserOperateDrawer from './modules/user-operate-drawer.vue';
import UserSearch from './modules/user-search.vue';

// 获取应用状态（用于判断移动端并切换表格 flex-height 与分页）
const appStore = useAppStore();

// 用户列表查询参数（分页参数 + 条件筛选字段）
const searchParams: Api.SystemManage.UserSearchParams = reactive({
  current: 1,
  size: 10,
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
});

// 分页表格 Hook：负责数据获取、列配置、分页联动与 loading 状态
const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  // 数据接口：携带查询参数请求用户列表
  api: () => fetchGetUserList(searchParams),
  // 数据转换：统一转换为 table 需要的结构
  transform: response => defaultTransform(response),
  // 分页参数变化回调：同步写入 searchParams
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  // 列配置（包含选择列/序号/字段列/状态 Tag/操作列）
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => index + 1
    },
    {
      key: 'userName',
      title: $t('page.manage.user.userName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userGender',
      title: $t('page.manage.user.userGender'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.userGender === null) {
          return null;
        }

        // 性别 Tag 颜色映射
        const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
          1: 'primary',
          2: 'error'
        };

        // 性别文案（i18n）
        const label = $t(userGenderRecord[row.userGender]);

        return <NTag type={tagMap[row.userGender]}>{label}</NTag>;
      }
    },
    {
      key: 'nickName',
      title: $t('page.manage.user.nickName'),
      align: 'center',
      minWidth: 100
    },
    {
      key: 'userPhone',
      title: $t('page.manage.user.userPhone'),
      align: 'center',
      width: 120
    },
    {
      key: 'userEmail',
      title: $t('page.manage.user.userEmail'),
      align: 'center',
      minWidth: 200
    },
    {
      key: 'status',
      title: $t('page.manage.user.userStatus'),
      align: 'center',
      width: 100,
      render: row => {
        if (row.status === null) {
          return null;
        }

        // 启用状态 Tag 颜色映射
        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        // 状态文案（i18n）
        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          {/* 编辑按钮 */}
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          {/* 删除确认弹窗 */}
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

// 表格操作 Hook：封装新增/编辑抽屉、勾选行、删除后的刷新等逻辑
const {
  drawerVisible,
  operateType,
  editingData,
  handleAdd,
  handleEdit,
  checkedRowKeys,
  onBatchDeleted,
  onDeleted
  // closeDrawer
} = useTableOperate(data, 'id', getData);

// 批量删除（示例占位，真实项目应调用批量删除接口）
async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

// 单条删除（示例占位，真实项目应调用删除接口）
function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

// 编辑（通过 id 查找行数据并打开抽屉）
function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <!-- 用户管理页：搜索区 + 表格 + 新增/编辑抽屉 -->
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <!-- 搜索表单 -->
    <UserSearch v-model:model="searchParams" @search="getDataByPage" />
    <!-- 列表卡片 -->
    <NCard :title="$t('page.manage.user.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <!-- 表头操作：列设置/新增/删除/刷新 -->
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <!-- 用户列表表格 -->
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <!-- 新增/编辑抽屉 -->
      <UserOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
