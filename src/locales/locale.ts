import zhCN from './langs/zh-cn';
import enUS from './langs/en-us';

// 语言包映射：将 LangType 映射到对应的 Schema（中文/英文）
const locales: Record<App.I18n.LangType, App.I18n.Schema> = {
  // 中文（简体）
  'zh-CN': zhCN,
  // 英文（美式）
  'en-US': enUS
  // locales 对象定义结束
};

// 默认导出语言包映射
export default locales;
