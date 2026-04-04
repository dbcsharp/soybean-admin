import type { PiniaPluginContext } from 'pinia';
import { jsonClone } from '@sa/utils';
import { SetupStoreId } from '@/enum';

/**
 * The plugin reset the state of the store which is written by setup syntax
 *
 * @param context
 */
// Pinia 插件：为 setup 语法创建的 store 注入 $reset，实现回到初始 state 的能力
export function resetSetupStore(context: PiniaPluginContext) {
  // 收集所有 setup 写法 store 的 $id（来自枚举定义）
  const setupSyntaxIds = Object.values(SetupStoreId) as string[];

  // 当当前 store 的 id 属于 setup 语法 store 列表时才注入 $reset
  if (setupSyntaxIds.includes(context.store.$id)) {
    // 读取当前 store 的 state 快照
    const { $state } = context.store;

    // 深拷贝一份默认 state，作为重置的目标值
    const defaultStore = jsonClone($state);

    // 覆写/注入 $reset 方法：通过 $patch 回填默认 state
    context.store.$reset = () => {
      // 将默认 state 合并回 store，达到重置效果
      context.store.$patch(defaultStore);
      // $reset 回调结束
    };
    // if 分支结束
  }
  // resetSetupStore 函数结束
}
