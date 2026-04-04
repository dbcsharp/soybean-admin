import useBoolean from './use-boolean';

/**
 * Loading Hook（基于 useBoolean 封装 loading 状态与开始/结束方法）
 *
 * @param initValue 初始值
 */
export default function useLoading(initValue = false) {
  // loading 状态与控制方法（startLoading/endLoading）
  const { bool: loading, setTrue: startLoading, setFalse: endLoading } = useBoolean(initValue);

  // 返回 loading 状态与控制方法
  return {
    loading,
    startLoading,
    endLoading
  };
}
