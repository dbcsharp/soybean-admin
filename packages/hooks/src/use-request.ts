import { ref } from 'vue';
import type { Ref } from 'vue';
import { createFlatRequest } from '@sa/axios';
import type {
  AxiosError,
  CreateAxiosDefaults,
  CustomAxiosRequestConfig,
  MappedType,
  RequestInstanceCommon,
  RequestOption,
  ResponseType
} from '@sa/axios';
import useLoading from './use-loading';

// Hook 请求返回结构：成功时 data 有值、error 为 null
export type HookRequestInstanceResponseSuccessData<ApiData> = {
  // 响应数据（Ref）
  data: Ref<ApiData>;
  // 错误为空
  error: Ref<null>;
};

// Hook 请求返回结构：失败时 data 为 null、error 有值
export type HookRequestInstanceResponseFailData<ResponseData> = {
  // 数据为空
  data: Ref<null>;
  // AxiosError（Ref）
  error: Ref<AxiosError<ResponseData>>;
};

// Hook 请求返回结构：包含 loading，并根据成功/失败返回不同的 data/error
export type HookRequestInstanceResponseData<ResponseData, ApiData> = {
  // loading 状态
  loading: Ref<boolean>;
} & (HookRequestInstanceResponseSuccessData<ApiData> | HookRequestInstanceResponseFailData<ResponseData>);

// HookRequestInstance：与 RequestInstanceCommon 一致，调用返回 { loading, data, error }
export interface HookRequestInstance<
  ResponseData,
  ApiData,
  State extends Record<string, unknown>
> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig
  ): HookRequestInstanceResponseData<ResponseData, MappedType<R, T>>;
}

/**
 * 创建 Hook 请求实例（中文说明：基于 createFlatRequest，返回带 loading/data/error 的组合式调用）
 *
 * @param axiosConfig Axios 默认配置
 * @param options 请求 options（transform/onRequest/onError 等）
 */
export default function createHookRequest<ResponseData, ApiData, State extends Record<string, unknown>>(
  axiosConfig?: CreateAxiosDefaults,
  options?: Partial<RequestOption<ResponseData, ApiData, State>>
) {
  // 创建扁平请求实例（永不 throw）
  const request = createFlatRequest<ResponseData, ApiData, State>(axiosConfig, options);

  // Hook 请求函数：每次调用创建独立的 loading/data/error
  const hookRequest: HookRequestInstance<ResponseData, ApiData, State> = function hookRequest<
    T extends ApiData = ApiData,
    R extends ResponseType = 'json'
  >(config: CustomAxiosRequestConfig) {
    // loading 状态与控制方法
    const { loading, startLoading, endLoading } = useLoading();

    // data/error 状态
    const data = ref(null) as Ref<MappedType<R, T>>;
    const error = ref(null) as Ref<AxiosError<ResponseData> | null>;

    // 开始 loading
    startLoading();

    // 发起请求：成功写入 data，失败写入 error
    request(config).then(res => {
      if (res.data) {
        data.value = res.data as MappedType<R, T>;
      } else {
        error.value = res.error;
      }

      // 结束 loading
      endLoading();
    });

    // 返回状态
    return {
      loading,
      data,
      error
    };
  } as HookRequestInstance<ResponseData, ApiData, State>;

  // 透传取消全部请求方法
  hookRequest.cancelAllRequest = request.cancelAllRequest;

  // 返回 hookRequest 实例
  return hookRequest;
}
