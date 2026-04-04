import { extend } from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import { setDayjsLocale } from '../locales/dayjs';

// 初始化 Dayjs（注册 localeData 插件，并设置默认语言）
export function setupDayjs() {
  // 注册 localeData 插件（用于获取月份/星期等本地化信息）
  extend(localeData);

  // 设置 Dayjs 语言（默认从本地缓存读取）
  setDayjsLocale();
}
