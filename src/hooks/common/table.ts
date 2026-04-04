// NaiveUI Table 组合式 Hook：封装列表请求、列显隐、横向滚动宽度计算、分页与通用表格操作等能力
import { computed, effectScope, onScopeDispose, reactive, shallowRef, watch } from 'vue';
import type { Ref } from 'vue';
import type { PaginationProps } from 'naive-ui';
import { useBoolean, useTable } from '@sa/hooks';
import type { PaginationData, TableColumnCheck, UseTableOptions } from '@sa/hooks';
import type { FlatResponseData } from '@sa/axios';
import { jsonClone } from '@sa/utils';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

// Naive Table Hook 的参数类型：基于 useTable 的配置，去掉内部会被本文件接管的选项
export type UseNaiveTableOptions<ResponseData, ApiData, Pagination extends boolean> = Omit<
  // 复用 useTable 的配置类型，并指定 NaiveUI TableColumn 类型
  UseTableOptions<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, Pagination>,
  // 排除分页与列配置相关选项（由本 Hook 自己处理）
  'pagination' | 'getColumnChecks' | 'getColumns'
  // Omit 结束
> & {
  /**
   * get column visible
   *
   * @param column
   *
   * @default true
   *
   * @returns true if the column is visible, false otherwise
   */
  // 获取列是否可见（用于决定列在列选择面板/渲染时的默认可见性）
  getColumnVisible?: (column: NaiveUI.TableColumn<ApiData>) => boolean;
  // UseNaiveTableOptions 类型扩展结束
};

// selection 列在列检查映射中的内部 key（用于区分非 key 列）
const SELECTION_KEY = '__selection__';

// expand 列在列检查映射中的内部 key（用于区分非 key 列）
const EXPAND_KEY = '__expand__';

// 非分页表格 Hook（基于 useTable 封装列显隐检查与横向滚动宽度计算）
export function useNaiveTable<ResponseData, ApiData>(options: UseNaiveTableOptions<ResponseData, ApiData, false>) {
  // 创建独立的副作用作用域，便于在 hook 销毁时统一停止 watch
  const scope = effectScope();
  // 获取应用状态（用于监听语言变化并刷新列标题等）
  const appStore = useAppStore();

  // 创建 useTable 结果，并注入列检查与列过滤逻辑
  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, false>({
    // 透传外部 options
    ...options,
    // 根据列定义生成列勾选配置（支持传入 getColumnVisible 控制默认可见）
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    // 根据勾选配置过滤并生成最终 columns
    getColumns
    // useTable 配置对象结束
  });

  // calculate the total width of the table this is used for horizontal scrolling
  // 计算表格横向滚动宽度（根据列宽汇总得到 scrollX，用于水平滚动）
  const scrollX = computed(() => getScrollX(result.columns.value));

  // 在独立 scope 内注册 watch，便于统一停止与释放
  scope.run(() => {
    // 监听语言变化，刷新列（用于重新计算列标题等 i18n 内容）
    watch(
      // 监听源：当前语言
      () => appStore.locale,
      // 回调：重新加载列定义
      () => {
        // 触发列重载（内部会重新生成 columns/checks）
        result.reloadColumns();
        // watch(appStore.locale) 回调结束
      }
      // watch(appStore.locale) 调用结束
    );
    // scope.run 回调结束
  });

  // 当前作用域销毁时停止 scope
  onScopeDispose(() => {
    // 停止所有在 scope 内创建的副作用（如 watch）
    scope.stop();
    // onScopeDispose 回调结束
  });

  // 对外暴露 useTable 结果与 scrollX 计算值
  return {
    // 透传 useTable 返回的所有能力
    ...result,
    // 横向滚动宽度（用于 Table 的 scroll-x）
    scrollX
    // 返回对象定义结束
  };
}

// 分页参数类型：只包含 page 与 pageSize
type PaginationParams = Pick<PaginationProps, 'page' | 'pageSize'>;

// 分页表格 Hook 的参数类型：在基础表格参数上增加分页配置与回调
type UseNaivePaginatedTableOptions<ResponseData, ApiData> = UseNaiveTableOptions<ResponseData, ApiData, true> & {
  // 额外分页组件属性（排除 page/pageSize/itemCount，由本 Hook 接管）
  paginationProps?: Omit<PaginationProps, 'page' | 'pageSize' | 'itemCount'>;
  /**
   * whether to show the total count of the table
   *
   * @default true
   */
  // 是否展示总条数（控制分页组件 prefix 的显示）
  showTotal?: boolean;
  // 分页参数变化回调（page/pageSize 变化时触发，可用于同步到请求参数）
  onPaginationParamsChange?: (params: PaginationParams) => void | Promise<void>;
  // UseNaivePaginatedTableOptions 类型定义结束
};

// 分页表格 Hook（封装 NaiveUI PaginationProps 与 useTable 的分页联动）
export function useNaivePaginatedTable<ResponseData, ApiData>(
  // 分页表格配置
  options: UseNaivePaginatedTableOptions<ResponseData, ApiData>
  // 参数列表结束
) {
  // 创建独立的副作用作用域，便于在 hook 销毁时统一停止 watch
  const scope = effectScope();
  // 获取应用状态（用于响应语言与移动端状态变化）
  const appStore = useAppStore();

  // 是否移动端（用于调整分页展示）
  const isMobile = computed(() => appStore.isMobile);

  // 是否展示总条数（默认 true）
  const showTotal = computed(() => options.showTotal ?? true);

  // 构造分页状态（响应式对象，将由 NaiveUI Pagination 直接消费）
  const pagination = reactive({
    // 当前页码
    page: 1,
    // 每页条数
    pageSize: 10,
    // 总条数（由接口返回后写入）
    itemCount: 0,
    // 是否显示每页条数选择器
    showSizePicker: true,
    // 可选的每页条数组合
    pageSizes: [10, 15, 20, 25, 30],
    // 分页前缀：展示总条数文案（可按 showTotal 开关）
    prefix: showTotal.value ? page => $t('datatable.itemCount', { total: page.itemCount }) : undefined,
    // 页码更新回调：同步写入 pagination.page
    onUpdatePage(page) {
      // 更新当前页码
      pagination.page = page;
      // onUpdatePage 回调结束
    },
    // 每页条数更新回调：同步写入 pagination.pageSize，并重置页码为 1
    onUpdatePageSize(pageSize) {
      // 更新每页条数
      pagination.pageSize = pageSize;
      // 改变每页条数后回到第一页
      pagination.page = 1;
      // onUpdatePageSize 回调结束
    },
    // 合并外部传入的分页属性（但不包含 page/pageSize/itemCount）
    ...options.paginationProps
    // pagination 响应式对象定义结束
  }) as PaginationProps;

  // this is for mobile, if the system does not support mobile, you can use `pagination` directly
  // 移动端分页计算值（移动端缩小页码槽位，并按需隐藏 prefix）
  const mobilePagination = computed(() => {
    // 构造最终提供给组件的分页属性对象
    const p: PaginationProps = {
      // 透传基础分页属性
      ...pagination,
      // 移动端减少页码槽位数量
      pageSlot: isMobile.value ? 3 : 9,
      // 移动端隐藏 prefix，非移动端按 showTotal 决定是否显示
      prefix: !isMobile.value && showTotal.value ? pagination.prefix : undefined
      // p 对象定义结束
    };

    // 返回移动端分页属性
    return p;
    // mobilePagination 计算回调结束
  });

  // 分页参数计算值（抽取 page/pageSize，用于 watch 触发请求）
  const paginationParams = computed(() => {
    // 解构当前分页参数
    const { page, pageSize } = pagination;

    // 返回分页参数对象
    return {
      // 当前页码
      page,
      // 每页条数
      pageSize
      // paginationParams 返回对象结束
    };
    // paginationParams 计算回调结束
  });

  // 创建 useTable 结果，并启用 pagination 模式与拉取后写入 itemCount/pageSize
  const result = useTable<ResponseData, ApiData, NaiveUI.TableColumn<ApiData>, true>({
    // 透传外部 options
    ...options,
    // 显式启用分页模式
    pagination: true,
    // 根据列定义生成列勾选配置（支持传入 getColumnVisible 控制默认可见）
    getColumnChecks: cols => getColumnChecks(cols, options.getColumnVisible),
    // 根据勾选配置过滤并生成最终 columns
    getColumns,
    // 数据拉取完成回调：同步接口返回的 total/pageSize 到分页状态
    onFetched: data => {
      // 写入总条数
      pagination.itemCount = data.total;
      // 写入接口返回的 pageSize（避免后端纠正 pageSize 时不同步）
      pagination.pageSize = data.pageSize;
      // onFetched 回调结束
    }
    // useTable 配置对象结束
  });

  // 计算表格横向滚动宽度（用于水平滚动）
  const scrollX = computed(() => getScrollX(result.columns.value));

  // 按指定页码获取数据（页码变化时只更新页码，由 watch 触发拉取；同页码则主动拉取）
  async function getDataByPage(page: number = 1) {
    // 当目标页码与当前页码不一致时，先更新页码并提前返回
    if (page !== pagination.page) {
      // 更新页码（后续会触发 paginationParams watch 拉取数据）
      pagination.page = page;

      // 交由 watch 触发请求，避免重复请求
      return;
      // page 判断分支结束
    }

    // 页码未变化时，直接主动拉取一次数据
    await result.getData();
  }

  // 在独立 scope 内注册 watch，便于统一停止与释放
  scope.run(() => {
    // 监听语言变化，刷新列（用于重新计算列标题等 i18n 内容）
    watch(
      // 监听源：当前语言
      () => appStore.locale,
      // 回调：重新加载列定义
      () => {
        // 触发列重载（内部会重新生成 columns/checks）
        result.reloadColumns();
        // watch(appStore.locale) 回调结束
      }
      // watch(appStore.locale) 调用结束
    );

    // 监听分页参数变化：触发外部回调并重新拉取数据
    watch(paginationParams, async newVal => {
      // 通知外部分页参数变化（例如同步到请求参数）
      await options.onPaginationParamsChange?.(newVal);

      // 拉取表格数据
      await result.getData();
      // watch(paginationParams) 回调结束
    });
    // scope.run 回调结束
  });

  // 当前作用域销毁时停止 scope
  onScopeDispose(() => {
    // 停止所有在 scope 内创建的副作用（如 watch）
    scope.stop();
    // onScopeDispose 回调结束
  });

  // 对外暴露 useTable 结果与分页相关能力
  return {
    // 透传 useTable 返回的所有能力
    ...result,
    // 横向滚动宽度（用于 Table 的 scroll-x）
    scrollX,
    // 按页获取数据方法
    getDataByPage,
    // 分页状态（用于直接绑定到 PaginationProps）
    pagination,
    // 适配移动端的分页计算值
    mobilePagination
    // 返回对象定义结束
  };
}

// 表格操作 Hook（封装新增/编辑抽屉、编辑数据、勾选行与删除成功后的统一提示/刷新）
export function useTableOperate<TableData>(
  // 表格数据源引用
  data: Ref<TableData[]>,
  // 行主键字段名（用于根据 id 定位编辑行）
  idKey: keyof TableData,
  // 重新获取数据的方法（用于新增/编辑/删除后刷新列表）
  getData: () => Promise<void>
  // 参数列表结束
) {
  // 抽屉显隐状态与控制方法
  const { bool: drawerVisible, setTrue: openDrawer, setFalse: closeDrawer } = useBoolean();

  // 当前操作类型（新增/编辑）
  const operateType = shallowRef<NaiveUI.TableOperateType>('add');

  // 触发新增操作（设置操作类型为 add 并打开抽屉）
  function handleAdd() {
    // 设置操作类型为新增
    operateType.value = 'add';
    // 打开抽屉
    openDrawer();
  }

  /** the editing row data */
  // 当前编辑行的数据副本（用于在抽屉内编辑，不直接污染表格数据源）
  const editingData = shallowRef<TableData | null>(null);

  // 触发编辑操作（根据 id 找到行数据，克隆后写入 editingData 并打开抽屉）
  function handleEdit(id: TableData[keyof TableData]) {
    // 设置操作类型为编辑
    operateType.value = 'edit';
    // 在数据源中查找对应行（找不到则为 null）
    const findItem = data.value.find(item => item[idKey] === id) || null;
    // 深拷贝一份用于编辑（避免直接修改原始数据）
    editingData.value = jsonClone(findItem);

    // 打开抽屉
    openDrawer();
  }

  /** the checked row keys of table */
  // 当前勾选的行 key 列表（用于批量操作）
  const checkedRowKeys = shallowRef<string[]>([]);

  /** the hook after the batch delete operation is completed */
  // 批量删除完成后的钩子（提示成功、清空勾选并刷新数据）
  async function onBatchDeleted() {
    // 提示删除成功
    window.$message?.success($t('common.deleteSuccess'));

    // 清空勾选行
    checkedRowKeys.value = [];

    // 重新拉取表格数据
    await getData();
  }

  /** the hook after the delete operation is completed */
  // 单条删除完成后的钩子（提示成功并刷新数据）
  async function onDeleted() {
    // 提示删除成功
    window.$message?.success($t('common.deleteSuccess'));

    // 重新拉取表格数据
    await getData();
  }

  // 对外暴露操作相关状态与方法
  return {
    // 抽屉可见状态
    drawerVisible,
    // 打开抽屉方法
    openDrawer,
    // 关闭抽屉方法
    closeDrawer,
    // 当前操作类型（add/edit）
    operateType,
    // 新增操作处理函数
    handleAdd,
    // 编辑数据副本
    editingData,
    // 编辑操作处理函数
    handleEdit,
    // 勾选行 key 列表
    checkedRowKeys,
    // 批量删除完成处理函数
    onBatchDeleted,
    // 单条删除完成处理函数
    onDeleted
    // 返回对象定义结束
  };
}

// 默认分页响应转换器（把后端分页结构扁平化为 PaginationData）
export function defaultTransform<ApiData>(
  // 接口响应数据（包含 data 与 error）
  response: FlatResponseData<any, Api.Common.PaginatingQueryRecord<ApiData>>
  // 参数列表结束
): PaginationData<ApiData> {
  // 解构响应数据与错误标记
  const { data, error } = response;

  // 无错误时按正常分页结构转换
  if (!error) {
    // 解构分页字段
    const { records, current, size, total } = data;

    // 返回标准化后的分页数据结构
    return {
      // 列表数据
      data: records,
      // 当前页码
      pageNum: current,
      // 每页条数
      pageSize: size,
      // 总条数
      total
      // 返回对象结束
    };
    // !error 分支结束
  }

  // 有错误时返回空数据的默认分页结构
  return {
    // 空列表数据
    data: [],
    // 默认页码为 1
    pageNum: 1,
    // 默认每页条数为 10
    pageSize: 10,
    // 默认总条数为 0
    total: 0
    // 返回对象结束
  };
}

// 生成列勾选配置（从 columns 中提取 key/title/fixed/visible，用于列显示控制）
function getColumnChecks<Column extends NaiveUI.TableColumn<any>>(
  // 列定义数组
  cols: Column[],
  // 可选：控制某列默认是否可见
  getColumnVisible?: (column: Column) => boolean
  // 参数列表结束
) {
  // 列勾选配置数组
  const checks: TableColumnCheck[] = [];

  // 遍历列定义并生成对应的勾选项
  cols.forEach(column => {
    // 普通列：存在 key 的列
    if (isTableColumnHasKey(column)) {
      // 推入普通列的勾选配置
      checks.push({
        // 勾选项 key：使用列 key
        key: column.key as string,
        // 勾选项标题：使用列标题
        title: column.title!,
        // 默认勾选为 true
        checked: true,
        // 固定位置：没有固定时使用 unFixed
        fixed: column.fixed ?? 'unFixed',
        // 可见性：优先使用 getColumnVisible 回调，否则默认 true
        visible: getColumnVisible?.(column) ?? true
        // push 对象结束
      });
      // isTableColumnHasKey 分支结束
    } else if (column.type === 'selection') {
      // selection 列：使用内部 SELECTION_KEY
      checks.push({
        // 勾选项 key：selection 内部 key
        key: SELECTION_KEY,
        // 勾选项标题：使用通用“勾选”文案
        title: $t('common.check'),
        // 默认勾选为 true
        checked: true,
        // 固定位置：没有固定时使用 unFixed
        fixed: column.fixed ?? 'unFixed',
        // 可见性：selection 默认不展示在列选择中（默认 false）
        visible: getColumnVisible?.(column) ?? false
        // push 对象结束
      });
      // selection 分支结束
    } else if (column.type === 'expand') {
      // expand 列：使用内部 EXPAND_KEY
      checks.push({
        // 勾选项 key：expand 内部 key
        key: EXPAND_KEY,
        // 勾选项标题：使用通用“展开列”文案
        title: $t('common.expandColumn'),
        // 默认勾选为 true
        checked: true,
        // 固定位置：没有固定时使用 unFixed
        fixed: column.fixed ?? 'unFixed',
        // 可见性：expand 默认不展示在列选择中（默认 false）
        visible: getColumnVisible?.(column) ?? false
        // push 对象结束
      });
      // expand 分支结束
    }
    // forEach 单次迭代结束
  });

  // 返回列勾选配置数组
  return checks;
}

// 根据勾选配置生成最终列数组（按勾选项顺序过滤列，并同步 fixed 设置）
function getColumns<Column extends NaiveUI.TableColumn<any>>(cols: Column[], checks: TableColumnCheck[]) {
  // 将列定义映射到 Map（便于通过 key 快速取回列对象）
  const columnMap = new Map<string, Column>();

  // 遍历列定义并写入映射（普通列用自身 key，特殊列用内部 key）
  cols.forEach(column => {
    // 普通列：存在 key 的列
    if (isTableColumnHasKey(column)) {
      // 用列 key 存入映射
      columnMap.set(column.key as string, column);
      // isTableColumnHasKey 分支结束
    } else if (column.type === 'selection') {
      // selection 列使用 SELECTION_KEY 存入映射
      columnMap.set(SELECTION_KEY, column);
      // selection 分支结束
    } else if (column.type === 'expand') {
      // expand 列使用 EXPAND_KEY 存入映射
      columnMap.set(EXPAND_KEY, column);
      // expand 分支结束
    }
    // forEach 单次迭代结束
  });

  // 按 checks 过滤出勾选列，并将 fixed 同步为 checks 中的设置
  const filteredColumns = checks
    // 过滤：只保留 checked 为 true 的列
    .filter(item => item.checked)
    // 映射：根据 check.key 取出列定义并覆盖 fixed
    .map(check => {
      // 返回列定义（若映射中不存在则为 undefined，但这里按 Column 强转保持类型一致）
      return {
        // 展开原列定义
        ...columnMap.get(check.key),
        // 使用 check.fixed 覆盖固定设置
        fixed: check.fixed
        // 返回对象结束
      } as Column;
      // map 单次迭代结束
    });

  // 返回最终列数组
  return filteredColumns;
}

// 判断列是否包含 key（用于区分普通列与 selection/expand 等特殊列）
export function isTableColumnHasKey<T>(column: NaiveUI.TableColumn<T>): column is NaiveUI.TableColumnWithKey<T> {
  // 通过断言读取 key 并转换为布尔值
  return Boolean((column as NaiveUI.TableColumnWithKey<T>).key);
}

// 计算横向滚动宽度（累加每列 width/minWidth，作为表格 scrollX）
function getScrollX<T>(columns: NaiveUI.TableColumn<T>[], minWidth: number = 120) {
  // 通过 reduce 累加每一列的宽度，得到总宽度
  return columns.reduce((acc, column) => {
    // 当前列优先取 width，其次 minWidth，最后使用 minWidth 默认值
    return acc + Number(column.width ?? column.minWidth ?? minWidth);
    // reduce 单次迭代结束
  }, 0);
}
