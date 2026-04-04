import { inject, provide } from 'vue';

/**
 * Context 工具（封装 provide/inject，用于在组件树中共享组合式状态）
 *
 * @example
 *   ```ts
 *   // 假设有 3 个 Vue 文件：A.vue、B.vue、C.vue，其中 A.vue 是 B.vue 与 C.vue 的父组件
 *
 *   // context.ts：定义上下文
 *   import { ref } from 'vue';
 *   import { useContext } from '@sa/hooks';
 *
 *   export const [provideDemoContext, useDemoContext] = useContext('demo', () => {
 *     const count = ref(0);
 *
 *     function increment() {
 *       count.value++;
 *     }
 *
 *     function decrement() {
 *       count.value--;
 *     }
 *
 *     return {
 *       count,
 *       increment,
 *       decrement
 *     };
 *   })
 *   ```
 *
 *   // A.vue：提供上下文
 *   ```vue
 *   <template>
 *     <div>A</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { provideDemoContext } from './context';
 *
 *   provideDemoContext();
 *   // const { increment } = provideDemoContext(); // 父组件也可以直接拿到上下文并操作
 *   </script>
 *   ```
 *
 *   // B.vue：消费上下文
 *   ```vue
 *   <template>
 *    <div>B</div>
 *   </template>
 *   <script setup lang="ts">
 *   import { useDemoContext } from './context';
 *
 *   const { count, increment } = useDemoContext();
 *   </script>
 *   ```;
 *
 *   // C.vue 与 B.vue 用法相同
 *
 * @param contextName Context 名称（用于生成唯一 Symbol key）
 * @param composable Context 工厂函数（返回要共享的状态与方法）
 */
export default function useContext<Arguments extends Array<any>, T>(
  contextName: string,
  composable: (...args: Arguments) => T
) {
  // 为该 context 创建唯一 key，避免与其它 context 冲突
  const key = Symbol(contextName);

  /**
   * 注入 context 值
   *
   * @param consumerName 消费者名称（可选）：传入时若未找到 provider 将抛错
   * @param defaultValue 默认值（当未提供 provider 时返回）
   * @returns context 值
   */
  const useInject = <N extends string | null | undefined = undefined>(
    consumerName?: N,
    defaultValue?: T
  ): N extends null | undefined ? T | null : T => {
    // 从 inject 获取值，若不存在则使用 defaultValue
    const value = inject(key, defaultValue);

    // consumerName 存在且 value 为空时抛错，提示必须在 provider 内使用
    if (consumerName && !value) {
      throw new Error(`\`${consumerName}\` must be used within \`${contextName}\``);
    }

    // @ts-expect-error - we want to return null if the value is undefined or null
    return value || null;
  };

  // 提供 context 值（执行 composable 得到 value，并通过 provide 注入）
  const useProvide = (...args: Arguments) => {
    // 创建 context 值
    const value = composable(...args);

    // 注入到组件树
    provide(key, value);

    // 返回 value，便于父组件直接操作
    return value;
  };

  // 返回 [provider, injector]，便于解构使用
  return [useProvide, useInject] as const;
}
