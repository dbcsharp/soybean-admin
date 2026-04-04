import axios, { AxiosError } from 'axios';
import type { AxiosResponse, CreateAxiosDefaults, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import { nanoid } from '@sa/utils';
import { createAxiosConfig, createDefaultOptions, createRetryOptions } from './options';
import { transformResponse } from './shared';
import { BACKEND_ERROR_CODE, REQUEST_ID_KEY } from './constant';
import type {
  CustomAxiosRequestConfig,
  FlatRequestInstance,
  MappedType,
  RequestInstance,
  RequestOption,
  ResponseType
} from './type';

// 创建通用请求实例（统一创建 axios 实例、注册 retry/拦截器，并提供 cancelAllRequest）
function createCommonRequest<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
>(axiosConfig?: CreateAxiosDefaults, options?: Partial<RequestOption<ResponseData, ApiData, State>>) {
  // 合并默认 options（含 transform/onRequest/onError/isBackendSuccess 等）
  const opts = createDefaultOptions<ResponseData, ApiData, State>(options);

  // 创建 axios 配置（合并默认值）
  const axiosConf = createAxiosConfig(axiosConfig);
  // 创建 axios 实例
  const instance = axios.create(axiosConf);

  // AbortController 缓存：用于集中取消请求
  const abortControllerMap = new Map<string, AbortController>();

  // 配置 axios-retry：按 axiosConf 生成重试策略
  const retryOptions = createRetryOptions(axiosConf);
  axiosRetry(instance, retryOptions);

  // 请求拦截器：注入 requestId、配置 AbortController、并执行 onRequest hook
  instance.interceptors.request.use(conf => {
    // 拷贝 config，避免直接修改入参
    const config: InternalAxiosRequestConfig = { ...conf };

    // 设置 requestId（用于追踪与取消请求）
    const requestId = nanoid();
    config.headers.set(REQUEST_ID_KEY, requestId);

    // 配置 AbortController：仅在未提供 signal 时创建并缓存
    if (!config.signal) {
      const abortController = new AbortController();
      config.signal = abortController.signal;
      abortControllerMap.set(requestId, abortController);
    }

    // 执行请求前 hook：允许外部注入鉴权头/额外参数等
    const handledConfig = opts.onRequest?.(config) || config;

    return handledConfig;
  });

  // 响应拦截器：统一处理后端成功判断、后端失败 hook、以及错误透出
  instance.interceptors.response.use(
    async response => {
      // 响应类型：默认 json
      const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';

      // 预处理响应（例如：解析 blob/json、或处理特殊 header）
      await transformResponse(response);

      // 非 json 响应或后端判断成功时直接放行
      if (responseType !== 'json' || opts.isBackendSuccess(response)) {
        return Promise.resolve(response);
      }

      // 后端业务失败处理：允许外部刷新 token 后重试等
      const fail = await opts.onBackendFail(response, instance);
      if (fail) {
        return fail;
      }

      // 构造“后端业务错误”AxiosError（使用自定义错误码标识）
      const backendError = new AxiosError<ResponseData>(
        'the backend request error',
        BACKEND_ERROR_CODE,
        response.config,
        response.request,
        response
      );

      // 统一错误处理 hook（例如：提示 toast/收集日志）
      await opts.onError(backendError);

      // 将错误抛出到调用方
      return Promise.reject(backendError);
    },
    async (error: AxiosError<ResponseData>) => {
      // 网络/超时等错误统一处理
      await opts.onError(error);

      return Promise.reject(error);
    }
  );

  // 取消全部请求（对所有 AbortController 执行 abort 并清空缓存）
  function cancelAllRequest() {
    abortControllerMap.forEach(abortController => {
      abortController.abort();
    });
    abortControllerMap.clear();
  }

  // 返回 axios 实例、处理后的 opts 与取消方法
  return {
    instance,
    opts,
    cancelAllRequest
  };
}

/**
 * 创建请求实例
 *
 * @param axiosConfig axios 配置
 * @param options 请求选项
 */
// 创建“返回业务数据”的请求实例（json 响应时返回 transform 结果，非 json 透出原 data）
export function createRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
  // 创建通用请求实例
  const { instance, opts, cancelAllRequest } = createCommonRequest<ResponseData, ApiData, State>(axiosConfig, options);

  // 业务请求函数：支持泛型 T 与 responseType R
  const request: RequestInstance<ApiData, State> = async function request<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    // 发起请求并得到响应
    const response: AxiosResponse<ResponseData> = await instance(config);

    // 获取响应类型（默认 json）
    const responseType = response.config?.responseType || 'json';

    // json 响应走 transform
    if (responseType === 'json') {
      return opts.transform(response);
    }

    // 非 json：直接透出原始响应数据
    return response.data as MappedType<R, T>;
  } as RequestInstance<ApiData, State>;

  // 挂载取消全部请求方法
  request.cancelAllRequest = cancelAllRequest;
  // 业务侧可挂载的共享状态（由外部自行维护）
  request.state = {} as State;

  // 返回请求实例
  return request;
}

/**
 * 创建扁平请求实例
 *
 * 响应数据使用扁平结构：{ data, error, response }
 *
 * @param axiosConfig axios 配置
 * @param options 请求选项
 */
// 创建“扁平返回值”的请求实例（永不 throw，返回 { data, error, response }）
export function createFlatRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
  // 创建通用请求实例
  const { instance, opts, cancelAllRequest } = createCommonRequest<ResponseData, ApiData, State>(axiosConfig, options);

  // 扁平请求函数：捕获异常并返回 error
  const flatRequest: FlatRequestInstance<ResponseData, ApiData, State> = async function flatRequest<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    try {
      // 发起请求
      const response: AxiosResponse<ResponseData> = await instance(config);

      // 获取响应类型（默认 json）
      const responseType = response.config?.responseType || 'json';

      // json 响应走 transform
      if (responseType === 'json') {
        const data = await opts.transform(response);

        return { data, error: null, response };
      }

      // 非 json：直接透出原始响应数据
      return { data: response.data as MappedType<R, T>, error: null, response };
    } catch (error) {
      // 捕获异常：返回 error 与可能存在的 response
      return { data: null, error, response: (error as AxiosError<ResponseData>).response };
    }
  } as FlatRequestInstance<ResponseData, ApiData, State>;

  // 挂载取消全部请求方法
  flatRequest.cancelAllRequest = cancelAllRequest;
  // 初始化共享状态（默认合并 opts.defaultState）
  flatRequest.state = {
    ...opts.defaultState
  } as State;

  // 返回扁平请求实例
  return flatRequest;
}

// 导出常量与类型
export { BACKEND_ERROR_CODE, REQUEST_ID_KEY };
export type * from './type';
export type { CreateAxiosDefaults, AxiosError };
