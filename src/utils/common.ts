// 通用工具：提供 Record->Option 转换、选项翻译与 HTML class 切换等能力
import { $t } from '@/locales';

/**
 * Transform record to option
 *
 * @example
 *   ```ts
 *   const record = {
 *     key1: 'label1',
 *     key2: 'label2'
 *   };
 *   const options = transformRecordToOption(record);
 *   // [
 *   //   { value: 'key1', label: 'label1' },
 *   //   { value: 'key2', label: 'label2' }
 *   // ]
 *   ```;
 *
 * @param record
 */
// 将 record 转换为下拉选项数组（中文说明：key 作为 value，value 作为 label）
export function transformRecordToOption<T extends Record<string, string>>(record: T) {
  // 将 record 转换为 entries 数组后映射为 { value, label } 结构
  return Object.entries(record).map(([value, label]) => ({
    // 选项值：使用 record 的 key
    value,
    // 选项展示文本：使用 record 的 value
    label
    // 单个 option 对象结束
  })) as CommonType.Option<keyof T, T[keyof T]>[];
  // transformRecordToOption 函数结束
}

/**
 * Translate options
 *
 * @param options
 */
// 翻译选项的 label（中文说明：把 label 作为 i18n key 进行翻译后回填）
export function translateOptions(options: CommonType.Option<string, App.I18n.I18nKey>[]) {
  // 遍历 options，并对每个 option 的 label 执行翻译
  return options.map(option => ({
    // 保留原 option 的其他字段
    ...option,
    // 使用 i18n 翻译后的 label 替换原 label
    label: $t(option.label)
    // 单个 option 映射结果结束
  }));
  // translateOptions 函数结束
}

/**
 * Toggle html class
 *
 * @param className
 */
// 切换 html 根节点 class（中文说明：返回 add/remove 方法用于控制 class）
export function toggleHtmlClass(className: string) {
  // 添加 class 的方法
  function add() {
    // 将 className 添加到 documentElement 的 classList 中
    document.documentElement.classList.add(className);
    // add 函数结束
  }

  // 移除 class 的方法
  function remove() {
    // 将 className 从 documentElement 的 classList 中移除
    document.documentElement.classList.remove(className);
    // remove 函数结束
  }

  // 对外暴露 add/remove 方法
  return {
    // 添加 class 的方法
    add,
    // 移除 class 的方法
    remove
    // 返回对象定义结束
  };
  // toggleHtmlClass 函数结束
}
