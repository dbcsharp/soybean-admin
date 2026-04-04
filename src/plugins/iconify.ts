import { addAPIProvider } from '@iconify/vue';

/** Setup the iconify offline */
// 初始化 Iconify 离线资源（配置 Iconify API Provider 资源地址）
export function setupIconifyOffline() {
  // 从环境变量读取 Iconify 资源地址
  const { VITE_ICONIFY_URL } = import.meta.env;

  // 配置存在时才注册 Provider
  if (VITE_ICONIFY_URL) {
    // 注册默认 provider 的资源列表
    addAPIProvider('', { resources: [VITE_ICONIFY_URL] });
    // if 分支结束
  }
}
