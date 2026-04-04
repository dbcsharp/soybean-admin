import { locale } from 'dayjs';
import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';
import { localStg } from '@/utils/storage';

/**
 * Set dayjs locale
 *
 * @param lang
 */
// 设置 Dayjs 语言（支持传入 LangType；未传时从本地缓存读取）
export function setDayjsLocale(lang: App.I18n.LangType = 'zh-CN') {
  // LangType -> Dayjs locale key 映射
  const localMap = {
    // 中文映射
    'zh-CN': 'zh-cn',
    // 英文映射
    'en-US': 'en'
    // localMap 对象结束
  } satisfies Record<App.I18n.LangType, string>;

  // 优先使用传入 lang，否则从本地缓存读取
  const l = lang || localStg.get('lang') || 'zh-CN';

  // 设置 Dayjs locale
  locale(localMap[l]);
}
