import { h } from 'vue';
import type { App } from 'vue';
import { NButton } from 'naive-ui';
import { $t } from '@/locales';

// 全局错误处理（捕获 Vue 运行时错误并输出到控制台）
export function setupAppErrorHandle(app: App) {
  // 注册 Vue 全局错误处理器
  app.config.errorHandler = (err, vm, info) => {
    // eslint-disable-next-line no-console
    // 输出错误对象、组件实例与额外信息
    console.error(err, vm, info);
    // errorHandler 回调结束
  };
}

// 应用版本更新提示（定时拉取 index.html 的 buildTime meta，变化时弹出更新通知）
export function setupAppVersionNotification() {
  // 检测间隔（毫秒）
  const UPDATE_CHECK_INTERVAL = 3 * 60 * 1000;

  // 是否启用自动检测更新（仅生产环境且开关开启）
  const canAutoUpdateApp = import.meta.env.VITE_AUTOMATICALLY_DETECT_UPDATE === 'Y' && import.meta.env.PROD;
  // 未启用则直接返回
  if (!canAutoUpdateApp) return;

  // 是否已显示更新通知（用于防止重复弹窗）
  let isShow = false;
  // 更新检查定时器引用
  let updateInterval: ReturnType<typeof setInterval> | undefined;

  // 检查是否存在新版本（拉取最新 buildTime 并与当前 BUILD_TIME 比较）
  const checkForUpdates = async () => {
    // 已显示弹窗时不重复检查
    if (isShow) return;

    // 获取最新 index.html 的 buildTime
    const buildTime = await getHtmlBuildTime();

    // 获取失败或与当前构建时间一致时不需要更新
    if (!buildTime || buildTime === BUILD_TIME) {
      // 直接返回
      return;
      // if 分支结束
    }

    // 标记已显示弹窗
    isShow = true;

    // 创建更新通知弹窗
    const n = window.$notification?.create({
      // 标题：有新版本
      title: $t('system.updateTitle'),
      // 内容：更新提示
      content: $t('system.updateContent'),
      // 自定义 action 区域（取消/刷新）
      action() {
        // 返回按钮容器 VNode
        return h('div', { style: { display: 'flex', justifyContent: 'end', gap: '12px', width: '325px' } }, [
          h(
            NButton,
            {
              onClick() {
                // 关闭通知
                n?.destroy();
                // 允许后续再次显示
                isShow = false;
                // 取消按钮点击回调结束
              }
            },
            // 取消按钮文案
            () => $t('system.updateCancel')
          ),
          h(
            NButton,
            {
              type: 'primary',
              onClick() {
                // 刷新页面以加载新版本
                location.reload();
                // 确认按钮点击回调结束
              }
            },
            // 确认按钮文案
            () => $t('system.updateConfirm')
          )
        ]);
        // action 回调结束
      },
      // 关闭通知时重置显示标记
      onClose() {
        // 允许后续再次显示
        isShow = false;
        // onClose 回调结束
      }
    });
    // checkForUpdates 回调结束
  };

  // 启动/重启更新检测定时器（确保只存在一个 interval）
  const startUpdateInterval = () => {
    // 已存在定时器时先清理
    if (updateInterval) {
      // 清除旧定时器
      clearInterval(updateInterval);
      // if 分支结束
    }
    // 创建新的定时器
    updateInterval = setInterval(checkForUpdates, UPDATE_CHECK_INTERVAL);
    // startUpdateInterval 回调结束
  };

  // 初始可见且未显示弹窗时，监听可见性变化并启动定时器
  if (!isShow && document.visibilityState === 'visible') {
    // 页面从隐藏切回可见时立即检查更新并重启定时器
    document.addEventListener('visibilitychange', () => {
      // 可见时才执行检查
      if (document.visibilityState === 'visible') {
        // 立即检查
        checkForUpdates();
        // 重启定时器
        startUpdateInterval();
        // visibilityState 分支结束
      }
      // visibilitychange 回调结束
    });

    // 启动定时器
    startUpdateInterval();
    // if 分支结束
  }
}

// 获取 index.html 中的 buildTime（通过 fetch 拉取 html 并用正则提取 meta）
async function getHtmlBuildTime(): Promise<string | null> {
  // 计算基础路径（用于兼容非根路径部署）
  const baseUrl = import.meta.env.VITE_BASE_URL || '/';

  // 捕获网络/解析异常，避免影响主流程
  try {
    // 拉取最新 index.html（添加时间戳避免缓存）
    const res = await fetch(`${baseUrl}index.html?time=${Date.now()}`);

    // HTTP 非 2xx 时返回 null
    if (!res.ok) {
      // 返回 null
      return null;
      // if 分支结束
    }

    // 读取 html 文本
    const html = await res.text();
    // 通过正则匹配 buildTime meta
    const match = html.match(/<meta name="buildTime" content="(.*)">/);
    // 返回匹配到的 buildTime 或 null
    return match?.[1] || null;
  } catch (error) {
    // 输出错误信息便于排查
    window.console.error('getHtmlBuildTime error:', error);
    // 返回 null 表示获取失败
    return null;
    // catch 分支结束
  }
}
