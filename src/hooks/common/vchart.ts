// VChart 组合式 Hook：负责主题初始化、图表实例创建/更新/销毁，并监听尺寸与暗黑模式变化
import { computed, effectScope, onScopeDispose, ref, watch } from 'vue';
import { useElementSize } from '@vueuse/core';
import VChart, { registerLiquidChart } from '@visactor/vchart';
import type { ISpec, ITheme } from '@visactor/vchart';
import light from '@visactor/vchart-theme/public/light.json';
import dark from '@visactor/vchart-theme/public/dark.json';
import { useThemeStore } from '@/store/modules/theme';

// 注册 Liquid 图表能力（按需注册，减少无用图表能力的体积）
registerLiquidChart();

// register the theme
// 注册亮色主题配置（供 ThemeManager 切换使用）
VChart.ThemeManager.registerTheme('light', light as ITheme);
// 注册暗色主题配置（供 ThemeManager 切换使用）
VChart.ThemeManager.registerTheme('dark', dark as ITheme);

// 图表生命周期钩子：在渲染、更新、销毁时向外部暴露回调
interface ChartHooks {
  // 图表首次渲染完成后的回调
  onRender?: (chart: VChart) => void | Promise<void>;
  // 图表完成一次更新后的回调
  onUpdated?: (chart: VChart) => void | Promise<void>;
  // 图表销毁前的回调（便于清理外部资源）
  onDestroy?: (chart: VChart) => void | Promise<void>;
  // ChartHooks 接口定义结束
}

// 创建并管理 VChart 实例：由 specFactory 生成 spec，并根据 hooks 执行生命周期回调
export function useVChart<T extends ISpec>(specFactory: () => T, hooks: ChartHooks = {}) {
  // 创建独立的副作用作用域，便于在 hook 销毁时统一停止 watch
  const scope = effectScope();
  // 获取主题状态仓库
  const themeStore = useThemeStore();
  // 将暗黑模式状态转成计算属性，供 watch 与渲染逻辑使用
  const darkMode = computed(() => themeStore.darkMode);

  // 保存图表挂载的 DOM 引用（由组件模板绑定）
  const domRef = ref<HTMLElement | null>(null);
  // 记录初始尺寸（用于避免尺寸为 0 时渲染）
  const initialSize = { width: 0, height: 0 };
  // 监听 DOM 尺寸变化（用于触发渲染/重绘流程）
  const { width, height } = useElementSize(domRef, initialSize);

  // 保存 VChart 实例引用（未创建时为 null）
  let chart: VChart | null = null;
  // 初始化图表 spec（后续通过 updateSpec / setSpec 修改）
  const spec: T = specFactory();

  // 解构生命周期钩子，便于内部直接调用
  const { onRender, onUpdated, onDestroy } = hooks;

  /**
   * 是否允许渲染图表（中文说明：DOM 就绪且尺寸有效才允许创建实例）
   * whether can render chart
   *
   * when domRef is ready and initialSize is valid
   */
  function canRender() {
    // DOM 存在且宽高都大于 0 时认为满足渲染条件
    return domRef.value && initialSize.width > 0 && initialSize.height > 0;
    // canRender 函数结束
  }

  /** is chart rendered */
  function isRendered() {
    // 同时具备 DOM 与 chart 实例时认为已渲染
    return Boolean(domRef.value && chart);
    // isRendered 函数结束
  }

  /**
   * 更新图表 spec（中文说明：通过回调生成增量配置并合并到现有 spec，再更新到图表）
   * update chart spec
   *
   * @param callback 中文说明：回调接收当前 spec 与 specFactory，用于返回新的 spec 配置
   * @param callback callback function
   */
  async function updateSpec(callback: (opts: T, optsFactory: () => T) => ISpec = () => spec) {
    // 未渲染时不允许更新（避免对空实例操作）
    if (!isRendered()) return;

    // 基于回调计算更新后的配置
    const updatedOpts = callback(spec, specFactory);

    // 将更新内容合并回原 spec（保持引用稳定，便于外部依赖）
    Object.assign(spec, updatedOpts);

    // 已渲染时先释放旧资源（例如图形缓存等）
    if (isRendered()) {
      // 释放当前图表资源，避免更新后残留旧渲染缓存
      chart?.release();
      // isRendered 分支结束
    }

    // 将新 spec 应用到图表（第二个参数为 true 表示强制更新/重新布局）
    chart?.updateSpec({ ...updatedOpts }, true);

    // 触发更新完成回调
    await onUpdated?.(chart!);
    // updateSpec 函数结束
  }

  // 直接设置新的 spec（中文说明：不做合并与释放逻辑，适用于整体替换）
  function setSpec(newSpec: T) {
    // 将新 spec 更新到图表实例
    chart?.updateSpec(newSpec);
    // setSpec 函数结束
  }

  /** render chart */
  async function render() {
    // 未渲染时才创建实例，避免重复 new VChart
    if (!isRendered()) {
      // apply the theme
      // 暗黑模式下切换到暗色主题
      if (darkMode.value) {
        // 设置当前主题为暗色主题
        VChart.ThemeManager.setCurrentTheme('dark');
        // darkMode 为 true 分支结束，进入 else 前的结构行
      } else {
        // 非暗黑模式下切换到亮色主题
        VChart.ThemeManager.setCurrentTheme('light');
        // darkMode 条件分支结束
      }

      // 创建 VChart 实例并绑定到 domRef 对应的元素
      chart = new VChart(spec, { dom: domRef.value as HTMLElement });
      // 同步渲染图表（保证后续 onRender 能拿到已完成渲染的实例）
      chart.renderSync();

      // 触发首次渲染完成回调
      await onRender?.(chart);
    }
    // render 函数结束
  }

  /** resize chart */
  function resize() {
    // 尺寸变化时的重绘入口（当前实现为占位，按需启用 chart.resize）
    // chart?.resize();
    // resize 函数结束
  }

  /** destroy chart */
  async function destroy() {
    // chart 不存在时无需处理
    if (!chart) return;

    // 触发销毁前回调（让外部有机会清理自定义资源）
    await onDestroy?.(chart);
    // 释放图表实例资源
    chart?.release();
    // 清空实例引用，标记为未渲染状态
    chart = null;
    // destroy 函数结束
  }

  /** change chart theme */
  async function changeTheme() {
    // 主题切换时先销毁旧实例，避免主题残留
    await destroy();
    // 重新渲染以应用新主题
    await render();
    // 主题切换后视作一次更新，触发更新回调
    await onUpdated?.(chart!);
    // changeTheme 函数结束
  }

  /**
   * 按尺寸渲染图表（中文说明：先更新尺寸，再根据渲染条件决定销毁/重绘/创建）
   * render chart by size
   *
   * @param w 中文说明：容器宽度
   * @param w width
   * @param h 中文说明：容器高度
   * @param h height
   */
  async function renderChartBySize(w: number, h: number) {
    // 写入最新宽度
    initialSize.width = w;
    // 写入最新高度
    initialSize.height = h;

    // size is abnormal, destroy chart
    // 尺寸异常（未满足渲染条件）时销毁图表并提前返回
    if (!canRender()) {
      // 尺寸异常时销毁实例，防止在不可渲染状态下占用资源
      await destroy();

      // 尺寸异常时直接返回，不再继续执行后续渲染逻辑
      return;
      // canRender 条件分支结束
    }

    // resize chart
    // 已渲染时根据新尺寸执行 resize 流程
    if (isRendered()) {
      // 根据最新尺寸触发图表重绘/自适应
      resize();
      // isRendered 条件分支结束
    }

    // render chart
    // 未渲染时创建并渲染图表
    await render();
    // renderChartBySize 函数结束
  }

  // 在独立 scope 内注册 watch，便于统一停止与释放
  scope.run(() => {
    // 监听容器宽高变化，并根据新尺寸触发渲染/重绘逻辑
    watch([width, height], ([newWidth, newHeight]) => {
      // 使用最新宽高驱动渲染流程（会在内部决定销毁/重绘/创建）
      renderChartBySize(newWidth, newHeight);
      // watch([width, height]) 回调结束
    });

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

  // 对外暴露：DOM 引用与更新方法
  return {
    // 图表挂载节点引用（组件中将其绑定到容器元素）
    domRef,
    // 增量更新 spec 的方法（支持回调生成新配置）
    updateSpec,
    // 直接替换 spec 的方法
    setSpec
    // 返回对象定义结束
  };
  // useVChart 函数结束
}
