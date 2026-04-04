import { computed, ref } from 'vue';
import type { Ref, VNodeChild } from 'vue';
import useBoolean from './use-boolean';
import useLoading from './use-loading';

// 分页数据结构（中文说明：后端分页接口常见返回结构）
export interface PaginationData<T> {
  // 当前页数据
  data: T[];
  // 当前页码
  pageNum: number;
  // 每页条数
  pageSize: number;
  // 总条数
  total: number;
}

// 根据 Pagination 开关推导 API 数据类型：分页时为 PaginationData，否则为数组
type GetApiData<ApiData, Pagination extends boolean> = Pagination extends true ? PaginationData<ApiData> : ApiData[];

// 响应转换函数类型：把 ResponseData 转换为表格数据结构
type Transform<ResponseData, ApiData, Pagination extends boolean> = (
  response: ResponseData
) => GetApiData<ApiData, Pagination>;

// 列设置 title 类型：字符串或渲染函数
export type TableColumnCheckTitle = string | ((...args: any) => VNodeChild);

// 列设置结构：用于列显隐与固定状态
export type TableColumnCheck = {
  // 列 key
  key: string;
  // 列标题
  title: TableColumnCheckTitle;
  // 是否勾选（显示）
  checked: boolean;
  // 是否可见（参与全选/统计等）
  visible: boolean;
  // 固定状态：left/right/unFixed
  fixed: 'left' | 'right' | 'unFixed';
};

// useTable 入参配置（中文说明：注入 api/transform/columns 工厂以及列设置相关方法）
export interface UseTableOptions<ResponseData, ApiData, Column, Pagination extends boolean> {
  /**
   * 请求表格数据的 API 方法
   */
  api: () => Promise<ResponseData>;
  /**
   * 是否启用分页
   */
  pagination?: Pagination;
  /**
   * 将 API 响应转换为表格数据
   */
  transform: Transform<ResponseData, ApiData, Pagination>;
  /**
   * 列定义工厂（返回 Column[]）
   */
  columns: () => Column[];
  /**
   * 从 columns 生成列设置（用于列显隐/固定等）
   */
  getColumnChecks: (columns: Column[]) => TableColumnCheck[];
  /**
   * 根据列设置生成最终 columns（用于渲染表格）
   */
  getColumns: (columns: Column[], checks: TableColumnCheck[]) => Column[];
  /**
   * 数据拉取完成回调（可用于二次处理）
   */
  onFetched?: (data: GetApiData<ApiData, Pagination>) => void | Promise<void>;
  /**
   * 是否立即拉取数据
   *
   * @default true
   */
  immediate?: boolean;
}

// 表格 Hook（中文说明：封装 loading/empty/data/columns 以及列设置与数据拉取）
export default function useTable<ResponseData, ApiData, Column, Pagination extends boolean>(
  options: UseTableOptions<ResponseData, ApiData, Column, Pagination>
) {
  // loading 状态
  const { loading, startLoading, endLoading } = useLoading();
  // empty 状态
  const { bool: empty, setBool: setEmpty } = useBoolean();

  // 解构 options
  const { api, pagination, transform, columns, getColumnChecks, getColumns, onFetched, immediate = true } = options;

  // 表格数据
  const data = ref([]) as Ref<ApiData[]>;

  // 列设置：初始由 getColumnChecks(columns()) 生成
  const columnChecks = ref(getColumnChecks(columns())) as Ref<TableColumnCheck[]>;

  // 最终 columns：由 columns 工厂 + columnChecks 派生
  const $columns = computed(() => getColumns(columns(), columnChecks.value));

  // 重载 columns（中文说明：保持用户勾选与固定状态，刷新列定义）
  function reloadColumns() {
    // 记录当前 checked/fixed 状态（key -> value）
    const checkMap = new Map(columnChecks.value.map(col => [col.key, col.checked]));
    const fixedMap = new Map(columnChecks.value.map(col => [col.key, col.fixed]));

    // 获取最新默认列设置
    const defaultChecks = getColumnChecks(columns());

    // 合并历史状态到最新列设置
    columnChecks.value = defaultChecks.map(col => ({
      ...col,
      checked: checkMap.get(col.key) ?? col.checked,
      fixed: (fixedMap.get(col.key) !== 'unFixed' ? fixedMap.get(col.key) : undefined) ?? col.fixed
    }));
  }

  // 拉取表格数据（中文说明：startLoading/endLoading 包裹，finally 确保结束）
  async function getData() {
    try {
      // 开始 loading
      startLoading();

      // 请求数据
      const response = await api();

      // 转换数据结构
      const transformed = transform(response);

      // 取出表格数据数组
      data.value = getTableData(transformed, pagination);

      // 更新 empty 状态
      setEmpty(data.value.length === 0);

      // 拉取完成回调
      await onFetched?.(transformed);
    } finally {
      // 结束 loading
      endLoading();
    }
  }

  // immediate=true 时自动拉取一次
  if (immediate) {
    getData();
  }

  // 返回表格状态与方法
  return {
    loading,
    empty,
    data,
    columns: $columns,
    columnChecks,
    reloadColumns,
    getData
  };
}

// 从 transformed 数据中提取表格 data 数组
function getTableData<ApiData, Pagination extends boolean>(
  data: GetApiData<ApiData, Pagination>,
  pagination?: Pagination
) {
  // 分页模式：取 PaginationData.data
  if (pagination) {
    return (data as PaginationData<ApiData>).data;
  }

  // 非分页：data 即为数组
  return data as ApiData[];
}
