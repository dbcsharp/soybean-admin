import NProgress from 'nprogress';

/** Setup plugin NProgress */
// 初始化 NProgress（中文说明：配置样式与速度，并挂载到 window 供路由守卫使用）
export function setupNProgress() {
  // 配置 NProgress 动画与速度
  NProgress.configure({ easing: 'ease', speed: 500 });

  // mount on window
  // 将 NProgress 挂载到 window，便于在路由守卫中调用
  window.NProgress = NProgress;
  // setupNProgress 函数结束
}
