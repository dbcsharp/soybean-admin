// 构建时间工具：以指定时区格式化生成构建时间字符串（用于注入 BUILD_TIME）
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

// 获取构建时间（使用上海时区输出 YYYY-MM-DD HH:mm:ss）
export function getBuildTime() {
  // 注册 utc 插件
  dayjs.extend(utc);
  // 注册 timezone 插件
  dayjs.extend(timezone);

  // 以 Asia/Shanghai 时区格式化当前时间
  const buildTime = dayjs.tz(Date.now(), 'Asia/Shanghai').format('YYYY-MM-DD HH:mm:ss');

  // 返回构建时间字符串
  return buildTime;
}
