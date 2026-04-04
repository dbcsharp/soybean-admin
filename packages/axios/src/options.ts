import type { CreateAxiosDefaults } from 'axios';
import type { IAxiosRetryConfig } from 'axios-retry';
import { stringify } from 'qs';
import { isHttpSuccess } from './shared';
import type { RequestOption } from './type';

// 创建默认请求 options（提供默认 transform/onRequest/onError 等钩子，并合并外部传入配置）
export function createDefaultOptions<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
>(options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  // 默认 options
  const opts: RequestOption<ResponseData, ApiData, State> = {
    // 默认共享状态
    defaultState: {} as State,
    // 默认 transform：返回 response.data
    transform: async response => response.data as unknown as ApiData,
    // 默认后端响应转换：返回 response.data
    transformBackendResponse: async response => response.data as unknown as ApiData,
    // 默认请求前 hook：原样返回 config
    onRequest: async config => config,
    // 默认后端成功判断：恒 true（业务侧应按后端约定覆盖）
    isBackendSuccess: _response => true,
    // 默认后端失败 hook：无处理
    onBackendFail: async () => {},
    // 默认错误 hook：无处理
    onError: async () => {}
  };

  // transform 优先级：显式 transform > transformBackendResponse > 默认 transform
  if (options?.transform) {
    opts.transform = options.transform;
  } else {
    opts.transform = options?.transformBackendResponse || opts.transform;
  }

  // 合并其它 options
  Object.assign(opts, options);

  // 返回最终 options
  return opts;
}

// 创建 axios-retry 配置（默认 retries=0，可通过 axiosConfig 覆盖）
export function createRetryOptions(config?: Partial<CreateAxiosDefaults>) {
  // 默认重试配置
  const retryConfig: IAxiosRetryConfig = {
    retries: 0
  };

  // 合并外部配置
  Object.assign(retryConfig, config);

  // 返回重试配置
  return retryConfig;
}

// 创建 axios 基础配置（包含超时、默认 JSON header、状态码校验与 params 序列化）
export function createAxiosConfig(config?: Partial<CreateAxiosDefaults>) {
  // 默认超时：10 秒
  const TEN_SECONDS = 10 * 1000;

  // 默认 axios 配置
  const axiosConfig: CreateAxiosDefaults = {
    timeout: TEN_SECONDS,
    headers: {
      'Content-Type': 'application/json'
    },
    // 状态码校验：仅 http 成功码通过
    validateStatus: isHttpSuccess,
    // query params 序列化：使用 qs.stringify
    paramsSerializer: params => {
      return stringify(params);
    }
  };

  // 合并外部配置
  Object.assign(axiosConfig, config);

  // 返回最终配置
  return axiosConfig;
}
