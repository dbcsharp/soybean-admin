<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { utils, writeFile } from 'xlsx';
import { enableStatusRecord, userGenderRecord } from '@/constants/business';
import { fetchGetUserList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { isTableColumnHasKey, useNaiveTable } from '@/hooks/common/table';
import { $t } from '@/locales';

// 获取应用状态（用于判断移动端并切换表格 flex-height）
const appStore = useAppStore();

// 查询参数（一次性拉取较多数据用于导出）
const searchParams: Api.SystemManage.UserSearchParams = reactive({
  current: 1,
  size: 999,
  status: null,
  userName: null,
  userGender: null,
  nickName: null,
  userPhone: null,
  userEmail: null
});

// 表格 Hook：负责数据获取与列配置
const { columns, data, loading } = useNaiveTable({
  // 数据接口：获取用户列表
  api: () => fetchGetUserList(searchParams),
  // 数据转换：返回 records 列表
  transform: response => {
    const { data: list, error } = response;

    if (!error) {
      return list.records;
    }

    return [];
  },
  // 列配置（与用户管理页类似，用于展示并作为导出列来源）
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

        const tagMap: Record<Api.SystemManage.UserGender, NaiveUI.ThemeColor> = {
          1: 'primary',
          2: 'error'
        };

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

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(enableStatusRecord[row.status]);

        return <NTag type={tagMap[row.status]}>{label}</NTag>;
      }
    }
  ]
});

// 导出 Excel（从表格列与数据生成 sheet，并写入文件）
function exportExcel() {
  // 导出列：跳过 selection/index 两列
  const exportColumns = columns.value.slice(2);

  // 将每行数据映射为二维数组（按列顺序）
  const excelList = data.value.map(item => exportColumns.map(col => getTableValue(col, item)));

  // 表头行：从列 title 中提取
  const titleList = exportColumns.map(col => (isTableColumnHasTitle(col) && col.title) || null);

  // 将表头插入到第一行
  excelList.unshift(titleList);

  // 创建工作簿
  const workBook = utils.book_new();

  // 创建工作表
  const workSheet = utils.aoa_to_sheet(excelList);

  // 设置列宽（按表格列 width 缩放）
  workSheet['!cols'] = exportColumns.map(item => ({
    width: Math.round(Number(item.width) / 10 || 20)
  }));

  // 追加工作表
  utils.book_append_sheet(workBook, workSheet, '用户列表');

  // 写入文件
  writeFile(workBook, '用户数据.xlsx');
}

// 获取表格单元格值（处理 roles/status/gender 等展示型字段）
function getTableValue(col: NaiveUI.TableColumn<Api.SystemManage.User>, item: Api.SystemManage.User) {
  if (!isTableColumnHasKey(col)) {
    return null;
  }

  const { key } = col;

  if (key === 'userRoles') {
    return item.userRoles.map(role => role).join(',');
  }

  if (key === 'status') {
    return (item.status && $t(enableStatusRecord[item.status])) || null;
  }

  if (key === 'userGender') {
    return (item.userGender && $t(userGenderRecord[item.userGender])) || null;
  }

  // @ts-expect-error the key is not in the type of Api.SystemManage.User
  return item[key] || null;
}

// 判断列是否包含 title（用于提取表头文本）
function isTableColumnHasTitle<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> & {
  title: string;
} {
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).title);
}
</script>

<template>
  <!-- Excel 导出示例页：展示用户表格并支持导出为 xlsx -->
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard title="Excel导出" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <!-- 导出按钮 -->
        <NSpace align="end" wrap justify="end" class="lt-sm:w-200px">
          <NButton size="small" ghost type="primary" @click="exportExcel">
            <template #icon>
              <icon-file-icons:microsoft-excel class="text-icon" />
            </template>
            导出excel
          </NButton>
        </NSpace>
      </template>

      <!-- 用户列表表格 -->
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="false"
        :virtual-scroll="true"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
