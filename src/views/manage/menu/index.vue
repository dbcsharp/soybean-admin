<script setup lang="tsx">
import { ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { yesOrNoRecord } from '@/constants/common';
import { enableStatusRecord, menuTypeRecord } from '@/constants/business';
import { fetchGetAllPages, fetchGetMenuList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

// 获取应用状态（用于判断移动端并切换表格 flex-height 与分页）
const appStore = useAppStore();

// 弹窗显隐控制
const { bool: visible, setTrue: openModal } = useBoolean();

// 页面容器引用（用于布局/滚动容器）
const wrapperRef = ref<HTMLElement | null>(null);

// 分页表格 Hook：负责数据获取、列配置、分页联动与 loading 状态
const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useNaivePaginatedTable({
  // 数据接口：获取菜单列表
  api: () => fetchGetMenuList(),
  // 数据转换：统一转换为 table 需要的结构
  transform: response => defaultTransform(response),
  // 列配置（中文说明：包含选择列/字段列/状态 Tag/是否隐藏/操作列）
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('page.manage.menu.id'),
      align: 'center'
    },
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        // 菜单类型 Tag 颜色映射
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'primary'
        };

        // 菜单类型文案（i18n）
        const label = $t(menuTypeRecord[row.menuType]);

        return <NTag type={tagMap[row.menuType]}>{label}</NTag>;
      }
    },
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'center',
      minWidth: 120,
      render: row => {
        // 优先使用 i18nKey，否则回退到 menuName
        const { i18nKey, menuName } = row;

        const label = i18nKey ? $t(i18nKey) : menuName;

        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        // iconType=1 使用 iconify 图标，否则使用本地图标
        const icon = row.iconType === '1' ? row.icon : undefined;

        const localIcon = row.iconType === '2' ? row.icon : undefined;

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'routeName',
      title: $t('page.manage.menu.routeName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'routePath',
      title: $t('page.manage.menu.routePath'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'status',
      title: $t('page.manage.menu.menuStatus'),
      align: 'center',
      width: 80,
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
      key: 'hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      align: 'center',
      width: 80,
      render: row => {
        // hideInMenu 布尔值转为 YesOrNo
        const hide: CommonType.YesOrNo = row.hideInMenu ? 'Y' : 'N';

        // 是否隐藏 Tag 颜色映射
        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        // 是否文案（i18n）
        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'order',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center justify-end gap-8px">
          {/* 目录类型才支持新增子菜单 */}
          {row.menuType === '1' && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          {/* 编辑按钮 */}
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
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

// 表格操作 Hook：封装勾选行、删除后的刷新等逻辑
const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, 'id', getData);

// 当前操作类型：新增/编辑/新增子菜单
const operateType = ref<OperateType>('add');

// 打开新增菜单弹窗
function handleAdd() {
  operateType.value = 'add';
  openModal();
}

// 批量删除（中文说明：示例占位，真实项目应调用批量删除接口）
async function handleBatchDelete() {
  // request
  console.log(checkedRowKeys.value);

  onBatchDeleted();
}

// 单条删除（中文说明：示例占位，真实项目应调用删除接口）
function handleDelete(id: number) {
  // request
  console.log(id);

  onDeleted();
}

/** the edit menu data or the parent menu data when adding a child menu */
// 当前编辑数据（中文说明：编辑时为当前菜单；新增子菜单时为父菜单）
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

// 打开编辑弹窗
function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

// 打开新增子菜单弹窗
function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

// 所有页面路径（中文说明：用于菜单页面组件选择）
const allPages = ref<string[]>([]);

// 拉取所有页面路径
async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages || [];
}

// 初始化（中文说明：预加载页面路径数据）
function init() {
  getAllPages();
}

// init
init();
</script>

<template>
  <!-- 菜单管理页：表格 + 新增/编辑/新增子菜单弹窗 -->
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
      <!-- 菜单列表表格 -->
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        :pagination="pagination"
        class="sm:h-full"
      />
      <!-- 菜单新增/编辑弹窗 -->
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
