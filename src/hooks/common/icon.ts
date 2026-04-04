// SvgIcon 组合式 Hook：封装 useSvgIconRender，并对外暴露 SvgIconVNode 渲染函数
import { useSvgIconRender } from '@sa/hooks';
import SvgIcon from '@/components/custom/svg-icon.vue';

// 获取 SvgIcon 的渲染 VNode 方法，便于在业务中快速渲染图标
export function useSvgIcon() {
  // 基于 SvgIcon 组件创建渲染函数
  const { SvgIconVNode } = useSvgIconRender(SvgIcon);

  // 对外返回渲染函数集合
  return {
    // SvgIcon 的 VNode 渲染函数（入参由 useSvgIconRender 定义）
    SvgIconVNode
    // 返回对象定义结束
  };
  // useSvgIcon 函数结束
}
