import { ref } from 'vue';

/**
 * Boolean Hook（封装布尔状态与常用操作方法）
 *
 * @param initValue 初始值
 */
export default function useBoolean(initValue = false) {
  // 布尔状态
  const bool = ref(initValue);

  // 设置布尔值
  function setBool(value: boolean) {
    bool.value = value;
  }
  // 设置为 true
  function setTrue() {
    setBool(true);
  }
  // 设置为 false
  function setFalse() {
    setBool(false);
  }
  // 取反切换
  function toggle() {
    setBool(!bool.value);
  }

  // 返回状态与操作方法
  return {
    bool,
    setBool,
    setTrue,
    setFalse,
    toggle
  };
}
