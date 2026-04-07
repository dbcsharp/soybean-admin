import { createApp } from 'vue';
import './plugins/assets';
import {
  setupAppVersionNotification,
  setupDayjs,
  setupIconifyOffline,
  setupLoading,
  setupNProgress,
  setupProNaiveComponents
} from './plugins';
import { setupVueRootValidator } from 'vite-plugin-vue-transition-root-validator/client';
import { setupStore } from './store';
import { setupRouter } from './router';
import { getLocale, setupI18n } from './locales';
import App from './App.vue';
// custom directives
import directives from '@/directives/index';

// 应用启动入口：按顺序初始化加载页、进度条、图标、Dayjs、Pinia、Router、i18n 与版本更新提示
async function setupApp() {
  // 注入首屏 Loading 内容（在 app.mount 前显示）
  setupLoading();

  // 初始化 NProgress（路由切换进度条）
  setupNProgress();

  // 初始化 Iconify 离线资源/自定义 API Provider
  setupIconifyOffline();

  // 初始化 Dayjs 插件与默认语言
  setupDayjs();

  // 创建 Vue 应用实例
  const app = createApp(App);

  // 安装 Pinia Store
  setupStore(app);

  // 安装 Router 并等待路由就绪
  await setupRouter(app);

  // 注册 Pro Naive UI 按需组件
  setupProNaiveComponents(app);

  // 安装 i18n
  setupI18n(app);

  // 启动版本更新检测与提示
  setupAppVersionNotification();

  // 安装 Root 过渡校验器（用于提示不合法的 Transition Root 结构）
  setupVueRootValidator(app, {
    // 根据当前语言选择校验器提示语言
    lang: getLocale() === 'zh-CN' ? 'zh' : 'en'
    // 配置对象结束
  });
  // 安装自定义指令
  app.use(directives);

  // 挂载应用到 #app
  app.mount('#app');
}

// 执行应用初始化
setupApp();
