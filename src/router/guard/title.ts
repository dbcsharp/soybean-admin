// 标题守卫：根据路由 meta 的 i18nKey/title 更新 document.title
import type { Router } from 'vue-router';
import { useTitle } from '@vueuse/core';
import { $t } from '@/locales';

// 创建文档标题守卫（中文说明：afterEach 读取 meta 并设置标题）
export function createDocumentTitleGuard(router: Router) {
  // 在路由切换结束后更新标题
  router.afterEach(to => {
    // 解构 meta 中的 i18nKey 与 title
    const { i18nKey, title } = to.meta;

    // 计算标题：优先翻译 i18nKey，否则使用 title
    const documentTitle = i18nKey ? $t(i18nKey) : title;

    // 设置 document.title
    useTitle(documentTitle);
    // afterEach 回调结束
  });
  // createDocumentTitleGuard 函数结束
}
