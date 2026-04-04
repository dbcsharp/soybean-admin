import type { ProxyOptions } from 'vite';
import { bgRed, bgYellow, green, lightBlue } from 'kolorist';
import { consola } from 'consola';
import { createServiceConfig } from '../../src/utils/service';

// 创建 Vite 代理配置（根据 env 中的 baseURL/other 服务生成 proxy 规则，并可选输出代理日志）
export function createViteProxy(env: Env.ImportMeta, enable: boolean) {
  // 是否启用代理：外部 enable 为 true 且 VITE_HTTP_PROXY=Y
  const isEnableHttpProxy = enable && env.VITE_HTTP_PROXY === 'Y';

  // 未启用代理时返回 undefined，让 Vite 使用默认行为
  if (!isEnableHttpProxy) return undefined;

  // 是否启用代理日志（用于调试代理请求与真实请求地址）
  const isEnableProxyLog = env.VITE_PROXY_LOG === 'Y';

  // 读取服务配置（包含默认服务与其他服务）
  const { baseURL, proxyPattern, other } = createServiceConfig(env);

  // 先创建默认服务的代理项
  const proxy: Record<string, ProxyOptions> = createProxyItem({ baseURL, proxyPattern }, isEnableProxyLog);

  // 追加其他服务的代理项
  other.forEach(item => {
    // 合并到 proxy 对象中
    Object.assign(proxy, createProxyItem(item, isEnableProxyLog));
    // forEach 单次迭代结束
  });

  // 返回完整 proxy 配置
  return proxy;
}

// 创建单个服务的 proxy 配置项（包含 target、rewrite 与可选的代理日志输出）
function createProxyItem(item: App.Service.ServiceConfigItem, enableLog: boolean) {
  // proxy 映射对象（key 为 proxyPattern）
  const proxy: Record<string, ProxyOptions> = {};

  // 用 proxyPattern 作为代理前缀 key
  proxy[item.proxyPattern] = {
    // 代理目标地址
    target: item.baseURL,
    // 改写 Origin 头，避免跨域限制
    changeOrigin: true,
    // 代理配置回调：用于注册代理事件并输出日志
    configure: (_proxy, options) => {
      _proxy.on('proxyReq', (_proxyReq, req, _res) => {
        // 未启用日志时直接返回
        if (!enableLog) return;

        // 输出代理访问的路径（代理前缀 + 原始 req.url）
        const requestUrl = `${lightBlue('[proxy url]')}: ${bgYellow(` ${req.method} `)} ${green(`${item.proxyPattern}${req.url}`)}`;

        // 输出真实请求地址（target + 原始 req.url）
        const proxyUrl = `${lightBlue('[real request url]')}: ${green(`${options.target}${req.url}`)}`;

        // 打印日志
        consola.log(`${requestUrl}\n${proxyUrl}`);
        // proxyReq 回调结束
      });
      _proxy.on('error', (_err, req, _res) => {
        // 未启用日志时直接返回
        if (!enableLog) return;
        // 输出代理错误日志
        consola.log(bgRed(`Error: ${req.method} `), green(`${options.target}${req.url}`));
        // error 回调结束
      });
      // configure 回调结束
    },
    // 重写路径：移除 proxyPattern 前缀，转发到真实后端
    rewrite: path => path.replace(new RegExp(`^${item.proxyPattern}`), '')
    // 单个 proxyPattern 配置结束
  };

  // 返回单个服务的 proxy 配置映射
  return proxy;
}
