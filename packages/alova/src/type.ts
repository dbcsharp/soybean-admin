import type { AlovaGenerics, AlovaOptions, AlovaRequestAdapter, Method, ResponseCompleteHandler } from 'alova';

export type CustomAlovaConfig<AG extends AlovaGenerics> = Omit<
  AlovaOptions<AG>,
  'statesHook' | 'beforeRequest' | 'responded' | 'requestAdapter'
> & {
  /** 请求适配器：Alova 的所有请求都将通过该适配器发送 */
  requestAdapter?: AlovaRequestAdapter<AG['RequestConfig'], AG['Response'], AG['ResponseHeader']>;
};

export interface RequestOptions<AG extends AlovaGenerics> {
  /**
   * 请求发送前 Hook
   *
   * 例如：可在此注入鉴权 token 到请求头
   *
   * @param method Alova Method 实例
   */
  onRequest?: AlovaOptions<AG>['beforeRequest'];
  /**
   * 判断后端响应是否成功
   *
   * @param response Alova 响应
   */
  isBackendSuccess: (response: AG['Response']) => Promise<boolean>;

  /** 刷新 token 配置（可选） */
  tokenRefresher?: {
    /** 判断 token 是否过期 */
    isExpired(response: AG['Response'], Method: Method<AG>): Promise<boolean> | boolean;
    /** 刷新 token 的处理函数 */
    handler(response: AG['Response'], Method: Method<AG>): Promise<void>;
  };

  /** 后端请求完成回调（可选） */
  onComplete?: ResponseCompleteHandler<AG>;

  /**
   * 错误处理 Hook
   *
   * 例如：可在此统一提示错误消息或上报日志
   *
   * @param error
   */
  onError?: (error: any, response: AG['Response'] | null, methodInstance: Method<AG>) => any | Promise<any>;
  /**
   * 转换后端响应（responseType 为 json 时使用）
   *
   * @param response Alova 响应
   */
  transformBackendResponse: (response: AG['Response']) => any;
}
