import { dateEnUS, dateZhCN, enUS, zhCN } from 'naive-ui';
import type { NDateLocale, NLocale } from 'naive-ui';

// NaiveUI 语言包映射（按 LangType 映射到 NaiveUI 的 NLocale）
export const naiveLocales: Record<App.I18n.LangType, NLocale> = {
  // 中文（简体）
  'zh-CN': zhCN,
  // 英文（美式）
  'en-US': enUS
  // naiveLocales 对象定义结束
};

// NaiveUI 日期语言包映射（按 LangType 映射到 NaiveUI 的 NDateLocale）
export const naiveDateLocales: Record<App.I18n.LangType, NDateLocale> = {
  // 中文（简体）
  'zh-CN': dateZhCN,
  // 英文（美式）
  'en-US': dateEnUS
  // naiveDateLocales 对象定义结束
};
