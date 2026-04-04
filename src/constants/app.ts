import { transformRecordToOption } from '@/utils/common';

// 应用常量：菜单 ID、主题/布局/登录模块等枚举映射与选项数组
export const GLOBAL_HEADER_MENU_ID = '__GLOBAL_HEADER_MENU__';

// 全局侧边菜单的内部标识（用于区分不同菜单容器）
export const GLOBAL_SIDER_MENU_ID = '__GLOBAL_SIDER_MENU__';

// 主题模式映射（light/dark/auto -> 对应 i18n key）
export const themeSchemaRecord: Record<UnionKey.ThemeScheme, App.I18n.I18nKey> = {
  // 亮色模式
  light: 'theme.appearance.themeSchema.light',
  // 暗黑模式
  dark: 'theme.appearance.themeSchema.dark',
  // 跟随系统
  auto: 'theme.appearance.themeSchema.auto'
  // themeSchemaRecord 对象定义结束
};

// 主题模式选项数组
export const themeSchemaOptions = transformRecordToOption(themeSchemaRecord);

// 登录模块映射（不同登录方式对应的 i18n key）
export const loginModuleRecord: Record<UnionKey.LoginModule, App.I18n.I18nKey> = {
  // 密码登录
  'pwd-login': 'page.login.pwdLogin.title',
  // 验证码登录
  'code-login': 'page.login.codeLogin.title',
  // 注册
  register: 'page.login.register.title',
  // 重置密码
  'reset-pwd': 'page.login.resetPwd.title',
  // 绑定微信
  'bind-wechat': 'page.login.bindWeChat.title'
  // loginModuleRecord 对象定义结束
};

// 布局模式映射（不同布局模式对应的 i18n key）
export const themeLayoutModeRecord: Record<UnionKey.ThemeLayoutMode, App.I18n.I18nKey> = {
  // 左侧菜单模式
  vertical: 'theme.layout.layoutMode.vertical',
  // 左侧菜单混合模式
  'vertical-mix': 'theme.layout.layoutMode.vertical-mix',
  // 左侧混合-顶部优先
  'vertical-hybrid-header-first': 'theme.layout.layoutMode.vertical-hybrid-header-first',
  // 顶部菜单模式
  horizontal: 'theme.layout.layoutMode.horizontal',
  // 顶部混合-侧边优先
  'top-hybrid-sidebar-first': 'theme.layout.layoutMode.top-hybrid-sidebar-first',
  // 顶部混合-顶部优先
  'top-hybrid-header-first': 'theme.layout.layoutMode.top-hybrid-header-first'
  // themeLayoutModeRecord 对象定义结束
};

// 布局模式选项数组
export const themeLayoutModeOptions = transformRecordToOption(themeLayoutModeRecord);

// 内容滚动模式映射（wrapper/content）
export const themeScrollModeRecord: Record<UnionKey.ThemeScrollMode, App.I18n.I18nKey> = {
  // 外层容器滚动
  wrapper: 'theme.layout.content.scrollMode.wrapper',
  // 内容区域滚动
  content: 'theme.layout.content.scrollMode.content'
  // themeScrollModeRecord 对象定义结束
};

// 内容滚动模式选项数组
export const themeScrollModeOptions = transformRecordToOption(themeScrollModeRecord);

// 标签页模式映射（chrome/button/slider）
export const themeTabModeRecord: Record<UnionKey.ThemeTabMode, App.I18n.I18nKey> = {
  // Chrome 风格
  chrome: 'theme.layout.tab.mode.chrome',
  // 按钮风格
  button: 'theme.layout.tab.mode.button',
  // 滑块风格
  slider: 'theme.layout.tab.mode.slider'
  // themeTabModeRecord 对象定义结束
};

// 标签页模式选项数组
export const themeTabModeOptions = transformRecordToOption(themeTabModeRecord);

// 页面切换动画模式映射（不同动画模式对应的 i18n key）
export const themePageAnimationModeRecord: Record<UnionKey.ThemePageAnimateMode, App.I18n.I18nKey> = {
  // 渐隐滑动
  'fade-slide': 'theme.layout.content.page.mode.fade-slide',
  // 渐隐
  fade: 'theme.layout.content.page.mode.fade',
  // 从底部渐隐
  'fade-bottom': 'theme.layout.content.page.mode.fade-bottom',
  // 渐隐缩放
  'fade-scale': 'theme.layout.content.page.mode.fade-scale',
  // 缩放渐隐
  'zoom-fade': 'theme.layout.content.page.mode.zoom-fade',
  // 缩放退出
  'zoom-out': 'theme.layout.content.page.mode.zoom-out',
  // 无动画
  none: 'theme.layout.content.page.mode.none'
  // themePageAnimationModeRecord 对象定义结束
};

// 页面切换动画模式选项数组
export const themePageAnimationModeOptions = transformRecordToOption(themePageAnimationModeRecord);

// 暗黑模式 class 名（用于挂载到 html）
export const DARK_CLASS = 'dark';

// 水印时间格式选项（用于水印配置中的时间格式下拉）
export const watermarkTimeFormatOptions = [
  // 年-月-日 时:分
  { label: 'YYYY-MM-DD HH:mm', value: 'YYYY-MM-DD HH:mm' },
  // 年-月-日 时:分:秒
  { label: 'YYYY-MM-DD HH:mm:ss', value: 'YYYY-MM-DD HH:mm:ss' },
  // 年/月/日 时:分
  { label: 'YYYY/MM/DD HH:mm', value: 'YYYY/MM/DD HH:mm' },
  // 年/月/日 时:分:秒
  { label: 'YYYY/MM/DD HH:mm:ss', value: 'YYYY/MM/DD HH:mm:ss' },
  // 时:分
  { label: 'HH:mm', value: 'HH:mm' },
  // 时:分:秒
  { label: 'HH:mm:ss', value: 'HH:mm:ss' },
  // 月-日 时:分
  { label: 'MM-DD HH:mm', value: 'MM-DD HH:mm' }
  // watermarkTimeFormatOptions 数组结束
];
