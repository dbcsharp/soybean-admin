import type { App } from 'vue';
import { createI18n } from 'vue-i18n';
import { localStg } from '@/utils/storage';
import messages from './locale';

// i18n 实例：创建 vue-i18n，并从本地缓存读取默认语言与回退语言
const i18n = createI18n({
  // 当前语言（优先从本地存储读取）
  locale: localStg.get('lang') || 'zh-CN',
  // 回退语言（当 key 不存在时使用）
  fallbackLocale: 'en',
  // 语言包 messages
  messages,
  // 使用 Composition API 模式
  legacy: false
  // createI18n 配置对象结束
});

/**
 * Setup plugin i18n
 *
 * @param app
 */
// 安装 i18n 插件（中文说明：将 i18n 挂载到 Vue 应用实例）
export function setupI18n(app: App) {
  // 将 i18n 安装到 app
  app.use(i18n);
  // setupI18n 函数结束
}

// 全局 $t 方法（中文说明：从 i18n.global.t 提取并强转类型）
export const $t = i18n.global.t as App.I18n.$T;

// 设置当前语言（中文说明：更新 i18n locale，并同步 html lang 属性）
export function setLocale(locale: App.I18n.LangType) {
  // 写入 i18n 的响应式 locale
  i18n.global.locale.value = locale;

  // 同步设置 html 标签的 lang 属性
  document?.querySelector('html')?.setAttribute('lang', locale);
  // setLocale 函数结束
}

// 获取当前语言（中文说明：返回 i18n.global.locale 的当前值）
export function getLocale(): App.I18n.LangType {
  // 返回当前语言
  return i18n.global.locale.value as App.I18n.LangType;
  // getLocale 函数结束
}
