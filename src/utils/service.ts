// 服务配置工具：根据当前环境变量生成接口 baseURL、其他服务 baseURL 与代理前缀
import json5 from 'json5';

// 创建服务配置（中文说明：解析 env 中的 baseURL 与其他服务配置，并组装为统一结构）
export function createServiceConfig(env: Env.ImportMeta) {
  // 从环境变量中读取默认服务 baseURL 与其他服务 baseURL 配置
  const { VITE_SERVICE_BASE_URL, VITE_OTHER_SERVICE_BASE_URL } = env;

  // 初始化其他服务配置对象（key 为其他服务标识，value 为 baseURL）
  let other = {} as Record<App.Service.OtherBaseURLKey, string>;
  // 解析 json5 字符串为对象（允许注释/更宽松的 JSON）
  try {
    // 将环境变量中的 json5 字符串解析为对象
    other = json5.parse(VITE_OTHER_SERVICE_BASE_URL);
    // try 分支结束
  } catch {
    // eslint-disable-next-line no-console
    // 解析失败时输出错误提示，帮助定位环境变量配置问题
    console.error('VITE_OTHER_SERVICE_BASE_URL is not a valid json5 string');
    // catch 分支结束
  }

  // 构造简单 http 配置（包含默认 baseURL 与其他服务 baseURL 映射）
  const httpConfig: App.Service.SimpleServiceConfig = {
    // 默认服务 baseURL
    baseURL: VITE_SERVICE_BASE_URL,
    // 其他服务 baseURL 映射
    other
    // httpConfig 对象结束
  };

  // 获取其他服务的 key 列表（用于生成 proxyPattern 等信息）
  const otherHttpKeys = Object.keys(httpConfig.other) as App.Service.OtherBaseURLKey[];

  // 将其他服务映射转换为数组结构（每个服务包含 key/baseURL/proxyPattern）
  const otherConfig: App.Service.OtherServiceConfigItem[] = otherHttpKeys.map(key => {
    // 返回单个其他服务配置项
    return {
      // 其他服务标识
      key,
      // 其他服务 baseURL
      baseURL: httpConfig.other[key],
      // 其他服务代理前缀
      proxyPattern: createProxyPattern(key)
      // 其他服务配置项对象结束
    };
    // map 单次迭代结束
  });

  // 构造完整服务配置（默认服务 + 其他服务数组 + 代理前缀）
  const config: App.Service.ServiceConfig = {
    // 默认服务 baseURL
    baseURL: httpConfig.baseURL,
    // 默认服务代理前缀
    proxyPattern: createProxyPattern(),
    // 其他服务配置数组
    other: otherConfig
    // config 对象结束
  };

  // 返回最终服务配置
  return config;
  // createServiceConfig 函数结束
}

// 获取实际请求 baseURL（中文说明：根据 isProxy 决定返回代理前缀还是直连 baseURL）
export function getServiceBaseURL(env: Env.ImportMeta, isProxy: boolean) {
  // 获取服务配置（包含默认与其他服务配置）
  const { baseURL, other } = createServiceConfig(env);

  // 其他服务 baseURL 映射（key -> baseURL 或 proxyPattern）
  const otherBaseURL = {} as Record<App.Service.OtherBaseURLKey, string>;

  // 遍历其他服务配置数组并填充映射
  other.forEach(item => {
    // 按 isProxy 决定写入代理前缀或真实 baseURL
    otherBaseURL[item.key] = isProxy ? item.proxyPattern : item.baseURL;
    // forEach 单次迭代结束
  });

  // 返回默认服务与其他服务的最终 baseURL 集合
  return {
    // 默认服务 baseURL：代理模式返回默认代理前缀，否则返回真实 baseURL
    baseURL: isProxy ? createProxyPattern() : baseURL,
    // 其他服务 baseURL 映射
    otherBaseURL
    // 返回对象结束
  };
  // getServiceBaseURL 函数结束
}

// 生成代理前缀（中文说明：默认服务使用 proxy-default，其他服务按 key 生成）
function createProxyPattern(key?: App.Service.OtherBaseURLKey) {
  // 未传 key 时使用默认服务代理前缀
  if (!key) {
    // 返回默认代理前缀
    return '/proxy-default';
    // !key 分支结束
  }

  // 返回指定 key 的代理前缀
  return `/proxy-${key}`;
  // createProxyPattern 函数结束
}
