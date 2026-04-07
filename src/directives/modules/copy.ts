import type { Directive, DirectiveBinding } from 'vue';
import { useClipboard } from '@vueuse/core';

interface ElType extends HTMLElement {
  copyData: any;
  __handleClick__: any;
}

// ✅ 关键：Hook 必须写在这里（指令根作用域）
const { copy, isSupported } = useClipboard();

const vCopy: Directive = {
  mounted(el: ElType, binding: DirectiveBinding) {
    // 先把初始值存到元素上
    el.copyData = binding.value;

    el.__handleClick__ = async () => {
      const text = el.copyData; // ✅ 永远取最新值

      if (!isSupported) {
        window.$message?.error('您的浏览器不支持复制功能');
        return;
      }
      if (!text) {
        window.$message?.error('请输入要复制的内容');
        return;
      }

      await copy(text);
      window.$message?.success(`复制成功：${text}`);
    };

    el.addEventListener('click', el.__handleClick__);
  },

  // ✅ 必须加：值更新时同步到元素上
  updated(el: ElType, binding: DirectiveBinding) {
    el.copyData = binding.value;
  },

  // 清理事件
  unmounted(el: ElType) {
    el.removeEventListener('click', el.__handleClick__);
    el.__handleClick__ = null;
  }
};

export default vCopy;
