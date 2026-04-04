import type { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

export type ContentType =
  | 'text/html'
  | 'text/plain'
  | 'multipart/form-data'
  | 'application/json'
  | 'application/x-www-form-urlencoded'
  | 'application/octet-stream';

export type ResponseTransform<Input = any, Output = any> = (input: Input) => Output | Promise<Output>;

export interface RequestOption<
  ResponseData,
  ApiData = ResponseData,
  State extends Record<string, unknown> = Record<string, unknown>
> {
  /**
   * 默认共享状态（用于在请求实例上挂载可复用状态）
   */
  defaultState?: State;
  /**
   * 将 Axios 响应转换为业务数据
   *
   * @param response Axios 响应
   */
  transform: ResponseTransform<AxiosResponse<ResponseData>, ApiData>;
  /**
   * 将 Axios 响应转换为业务数据
   *
   * @deprecated 请使用 `transform`，将在下一个大版本 v3 移除
   * @param response Axios 响应
   */
  transformBackendResponse: ResponseTransform<AxiosResponse<ResponseData>, ApiData>;
  /**
   * 请求发送前 Hook
   *
   * 例如：可在此注入鉴权 token 到请求头
   *
   * @param config Axios 请求配置
   */
  onRequest: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>;
  /**
   * 判断后端响应是否成功的 Hook
   *
   * @param response Axios 响应
   */
  isBackendSuccess: (response: AxiosResponse<ResponseData>) => boolean;
  /**
   * 后端业务失败后的 Hook
   *
   * 例如：可在此处理 token 过期刷新并重试
   *
   * @param response Axios 响应
   * @param instance Axios 实例（可用于重试原请求）
   */
  onBackendFail: (
    response: AxiosResponse<ResponseData>,
    instance: AxiosInstance
  ) => Promise<AxiosResponse | null> | Promise<void>;
  /**
   * 错误处理 Hook
   *
   * 例如：可在此统一提示错误消息或上报日志
   *
   * @param error
   */
  onError: (error: AxiosError<ResponseData>) => void | Promise<void>;
}

interface ResponseMap {
  blob: Blob;
  text: string;
  arrayBuffer: ArrayBuffer;
  stream: ReadableStream<Uint8Array>;
  document: Document;
}
export type ResponseType = keyof ResponseMap | 'json';

export type MappedType<R extends ResponseType, JsonType = any> = R extends keyof ResponseMap
  ? ResponseMap[R]
  : JsonType;

export type CustomAxiosRequestConfig<R extends ResponseType = 'json'> = Omit<AxiosRequestConfig, 'responseType'> & {
  responseType?: R;
};

export interface RequestInstanceCommon<State extends Record<string, unknown>> {
  /**
   * 取消全部请求
   *
   * 如果请求配置中已提供 signal，则不会被收集进 AbortControllerMap
   */
  cancelAllRequest: () => void;
  /** 请求实例共享状态（业务侧可自行扩展/读写） */
  state: State;
}

/** 请求实例类型：json 响应返回 transform 后的数据，非 json 返回原始 response.data 映射 */
export interface RequestInstance<ApiData, State extends Record<string, unknown>> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<MappedType<R, T>>;
}

export type FlatResponseSuccessData<ResponseData, ApiData> = {
  data: ApiData;
  error: null;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseFailData<ResponseData> = {
  data: null;
  error: AxiosError<ResponseData>;
  response: AxiosResponse<ResponseData>;
};

export type FlatResponseData<ResponseData, ApiData> =
  | FlatResponseSuccessData<ResponseData, ApiData>
  | FlatResponseFailData<ResponseData>;

export interface FlatRequestInstance<
  ResponseData,
  ApiData,
  State extends Record<string, unknown>
> extends RequestInstanceCommon<State> {
  <T extends ApiData = ApiData, R extends ResponseType = 'json'>(
    config: CustomAxiosRequestConfig<R>
  ): Promise<FlatResponseData<ResponseData, MappedType<R, T>>>;
}
