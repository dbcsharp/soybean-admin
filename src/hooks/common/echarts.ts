// ECharts 组合式 Hook：按需注册图表/组件，创建与销毁实例，支持暗黑主题、尺寸自适应与配置增量更新
import { computed, effectScope, nextTick, onScopeDispose, shallowRef, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import * as echarts from 'echarts/core';
import { BarChart, GaugeChart, LineChart, PictorialBarChart, PieChart, RadarChart, ScatterChart } from 'echarts/charts';
import type {
  BarSeriesOption,
  GaugeSeriesOption,
  LineSeriesOption,
  PictorialBarSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
  ScatterSeriesOption
} from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  ToolboxComponentOption,
  TooltipComponentOption
} from 'echarts/components';
import { LabelLayout, UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import { useThemeStore } from '@/store/modules/theme';

// ECharts 组合配置类型：将常用系列与组件的 Option 组合为一个统一的 ECOption
export type ECOption = echarts.ComposeOption<
  // 柱状图系列配置
  | BarSeriesOption
  // 折线图系列配置
  | LineSeriesOption
  // 饼图系列配置
  | PieSeriesOption
  // 散点图系列配置
  | ScatterSeriesOption
  // 象形柱图系列配置
  | PictorialBarSeriesOption
  // 雷达图系列配置
  | RadarSeriesOption
  // 仪表盘系列配置
  | GaugeSeriesOption
  // 标题组件配置
  | TitleComponentOption
  // 图例组件配置
  | LegendComponentOption
  // 提示框组件配置
  | TooltipComponentOption
  // 网格组件配置
  | GridComponentOption
  // 工具箱组件配置
  | ToolboxComponentOption
  // 数据集组件配置
  | DatasetComponentOption
>;

// 按需注册 ECharts 组件/图表/特性/渲染器（减少体积，避免全量引入）
echarts.use([
  // 标题组件
  TitleComponent,
  // 图例组件
  LegendComponent,
  // 提示框组件
  TooltipComponent,
  // 网格组件
  GridComponent,
  // 数据集组件
  DatasetComponent,
  // 数据转换组件
  TransformComponent,
  // 工具箱组件
  ToolboxComponent,
  // 柱状图
  BarChart,
  // 折线图
  LineChart,
  // 饼图
  PieChart,
  // 散点图
  ScatterChart,
  // 象形柱图
  PictorialBarChart,
  // 雷达图
  RadarChart,
  // 仪表盘
  GaugeChart,
  // 标签布局特性
  LabelLayout,
  // 通用过渡动画特性
  UniversalTransition,
  // Canvas 渲染器
  CanvasRenderer
  // echarts.use 注册数组结束
]);

// 图表生命周期钩子：在渲染、更新、销毁时向外部暴露回调
interface ChartHooks {
  // 图表首次渲染完成后的回调
  onRender?: (chart: echarts.ECharts) => void | Promise<void>;
  // 图表完成一次更新后的回调
  onUpdated?: (chart: echarts.ECharts) => void | Promise<void>;
  // 图表销毁前的回调（便于清理外部资源）
  onDestroy?: (chart: echarts.ECharts) => void | Promise<void>;
  // ChartHooks 接口定义结束
}

/**
 * 创建并管理 ECharts 实例（支持暗黑主题、容器尺寸变化自适应、配置更新与销毁清理）
 * use echarts
 *
 * @param optionsFactory ECharts option 工厂函数，用于初始化与增量更新时生成 option
 * @param optionsFactory echarts options factory function
 * @param hooks 图表生命周期钩子（渲染/更新/销毁）
 * @param darkMode dark mode
 */
export function useEcharts<T extends ECOption>(optionsFactory: () => T, hooks: ChartHooks = {}) {
  // 创建独立的副作用作用域，便于在 hook 销毁时统一停止 watch
  const scope = effectScope();

  // 获取主题状态仓库
  const themeStore = useThemeStore();
  // 将暗黑模式状态转成计算属性，供 watch 与渲染逻辑使用
  const darkMode = computed(() => themeStore.darkMode);

  // 保存图表挂载的 DOM 引用（由组件模板绑定）
  const domRef = shallowRef<HTMLElement | null>(null);
  // 记录初始尺寸（用于避免尺寸为 0 时渲染）
  const initialSize = { width: 0, height: 0 };
  // 监听 DOM 尺寸变化（用于触发渲染/重绘流程）
  const { width, height } = useElementSize(domRef, initialSize);

  // 保存 ECharts 实例引用（未创建时为 null）
  const chart = shallowRef<echarts.ECharts | null>(null);
  // 初始化图表 options（后续通过 updateOptions / setOptions 修改）
  const chartOptions: T = optionsFactory();

  // 解构生命周期钩子并提供默认实现（默认渲染时显示 loading，更新后隐藏）
  const {
    // 默认渲染回调：显示 Loading，并根据主题设置文本与遮罩颜色
    onRender = instance => {
      // 根据暗黑模式计算 loading 文本颜色
      const textColor = darkMode.value ? 'rgb(224, 224, 224)' : 'rgb(31, 31, 31)';
      // 根据暗黑模式计算 loading 遮罩颜色
      const maskColor = darkMode.value ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.8)';

      // 显示 loading（颜色使用主题主色）
      instance.showLoading({
        // loading 图形颜色
        color: themeStore.themeColor,
        // loading 文本颜色
        textColor,
        // loading 字号
        fontSize: 14,
        // loading 遮罩颜色
        maskColor
        // showLoading 配置对象结束
      });
      // onRender 默认实现结束
    },
    // 默认更新回调：隐藏 Loading
    onUpdated = instance => {
      // 更新完成后隐藏 loading
      instance.hideLoading();
      // onUpdated 默认实现结束
    },
    // 销毁回调：默认不处理，允许外部注入
    onDestroy
    // hooks 解构结束
  } = hooks;

  /** is chart rendered */
  // 判断图表是否已渲染（DOM 与 chart 实例同时存在）
  function isRendered() {
    // 同时具备 DOM 与 chart 实例时认为已渲染
    return Boolean(domRef.value && chart.value);
  }

  /**
   * 更新图表 options（通过回调生成增量配置并合并到现有 options，再 setOption 到图表）
   * update chart options
   *
   * @param callback 回调接收当前 options 与 optionsFactory，用于返回新的 option 配置
   * @param callback callback function
   */
  async function updateOptions(callback: (opts: T, optsFactory: () => T) => ECOption = () => chartOptions) {
    // 基于回调计算更新后的配置
    const updatedOpts = callback(chartOptions, optionsFactory);

    // 将更新内容合并回原 options（保持引用稳定，便于外部依赖）
    Object.assign(chartOptions, updatedOpts);

    // 等待下一次 DOM 更新（确保容器/布局已稳定）
    await nextTick();

    // 未渲染时不允许更新（避免对空实例操作）
    if (!isRendered()) return;

    // 更新前清空旧配置，避免残留 series/组件状态
    if (isRendered()) {
      // 清空实例当前配置
      chart.value?.clear();
      // isRendered 分支结束
    }

    // 将新 option 应用到图表（并强制设置透明背景，避免遮挡页面背景）
    chart.value?.setOption({ ...updatedOpts, backgroundColor: 'transparent' });

    // 触发更新完成回调
    await onUpdated?.(chart.value!);
  }

  // 直接设置新的 options（不做合并与清空逻辑，适用于整体替换）
  function setOptions(options: T) {
    // 将新 options 更新到图表实例
    chart.value?.setOption(options);
  }

  /** render chart */
  // 渲染图表（按主题初始化实例，并设置初始 option）
  async function render() {
    // 已渲染时直接返回，避免重复 init
    if (isRendered()) return;

    // 根据暗黑模式确定 ECharts 主题名称
    const chartTheme = darkMode.value ? 'dark' : 'light';

    // 初始化 ECharts 实例并绑定到 domRef 对应的元素
    chart.value = echarts.init(domRef.value, chartTheme);

    // 设置初始 option（并强制透明背景）
    chart.value?.setOption({ ...chartOptions, backgroundColor: 'transparent' });

    // 触发首次渲染完成回调
    await onRender?.(chart.value!);
  }

  /** resize chart */
  // 调整图表尺寸（在容器尺寸变化时调用）
  function resize() {
    // 调用 ECharts resize 以适配容器尺寸
    chart.value?.resize();
  }

  /** destroy chart */
  // 销毁图表（触发 onDestroy 回调并 dispose 实例）
  async function destroy() {
    // chart 不存在时无需处理
    if (!chart.value) return;

    // 触发销毁前回调（让外部有机会清理自定义资源）
    await onDestroy?.(chart.value);
    // 释放 ECharts 实例资源
    chart.value?.dispose();
    // 清空实例引用，标记为未渲染状态
    chart.value = null;
  }

  /** change chart theme */
  // 切换图表主题（销毁旧实例后按新主题重新渲染）
  async function changeTheme() {
    // 先销毁旧实例，避免主题残留
    await destroy();
    // 重新渲染以应用新主题
    await render();
    // 主题切换后视作一次更新，触发更新回调
    await onUpdated?.(chart.value!);
  }

  /**
   * 按尺寸渲染图表（已渲染则 resize，否则创建并渲染）
   * render chart by size
   *
   * @param w 容器宽度
   * @param w width
   * @param h 容器高度
   * @param h height
   */
  async function renderChartBySize(w: number, h: number) {
    // 写入最新宽度
    initialSize.width = w;
    // 写入最新高度
    initialSize.height = h;

    // resize chart
    // 已渲染时根据新尺寸执行 resize，并提前返回
    if (isRendered()) {
      // 触发图表自适应
      resize();

      // 已渲染情况下无需重复 render
      return;
      // isRendered 条件分支结束
    }

    // render chart
    // 未渲染时创建并渲染图表
    await render();

    // 渲染完成后触发一次更新回调（用于隐藏 loading 等）
    if (chart.value) {
      // 调用 onUpdated 钩子
      await onUpdated?.(chart.value);
      // chart.value 条件分支结束
    }
  }

  // 在独立 scope 内注册 watch，便于统一停止与释放
  scope.run(() => {
    // 监听容器宽高变化，并在布局更新后触发渲染/重绘逻辑
    watch(
      // 监听源：宽度与高度
      [width, height],
      // 回调：使用最新宽高驱动渲染流程
      ([newWidth, newHeight]) => {
        // 按新尺寸渲染/自适应
        renderChartBySize(newWidth, newHeight);
        // watch([width, height]) 回调结束
      },
      // 配置：在 DOM 更新后执行，避免读取到旧布局
      { flush: 'post' }
      // watch([width, height]) 调用结束
    );

    // 监听暗黑模式变化，并触发主题切换逻辑
    watch(darkMode, () => {
      // 暗黑模式变化时切换主题并刷新图表
      changeTheme();
      // watch(darkMode) 回调结束
    });
    // scope.run 回调结束
  });

  // 当前作用域销毁时执行资源清理与 scope 停止
  onScopeDispose(() => {
    // 销毁图表实例
    destroy();
    // 停止所有在 scope 内创建的副作用（如 watch）
    scope.stop();
    // onScopeDispose 回调结束
  });

  // 对外暴露：DOM 引用、图表实例引用与更新方法
  return {
    // 图表挂载节点引用（组件中将其绑定到容器元素）
    domRef,
    // ECharts 实例引用（可用于直接调用实例方法）
    chart,
    // 增量更新 options 的方法（支持回调生成新配置）
    updateOptions,
    // 直接替换 options 的方法
    setOptions
    // 返回对象定义结束
  };
}
