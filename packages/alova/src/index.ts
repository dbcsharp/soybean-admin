import { createAlova } from 'alova';
import type { AlovaDefaultCacheAdapter, AlovaGenerics, AlovaGlobalCacheAdapter, AlovaRequestAdapter } from 'alova';
import VueHook from 'alova/vue';
import type { VueHookType } from 'alova/vue';
import adapterFetch from 'alova/fetch';
import { createServerTokenAuthentication } from 'alova/client';
import type { FetchRequestInit } from 'alova/fetch';
import { BACKEND_ERROR_CODE } from './constant';
import type { CustomAlovaConfig, RequestOptions } from './type';

// 创建 Alova 请求实例（中文说明：封装 token 刷新、请求前 hook、后端成功判断与统一错误处理）
export const createAlovaRequest = <
  RequestConfig = FetchRequestInit,
  ResponseType = Response,
  ResponseHeader = Headers,
  L1Cache extends AlovaGlobalCacheAdapter = AlovaDefaultCacheAdapter,
  L2Cache extends AlovaGlobalCacheAdapter = AlovaDefaultCacheAdapter
>(
  customConfig: CustomAlovaConfig<
    AlovaGenerics<any, any, RequestConfig, ResponseType, ResponseHeader, L1Cache, L2Cache, any>
  >,
  options: RequestOptions<AlovaGenerics<any, any, RequestConfig, ResponseType, ResponseHeader, L1Cache, L2Cache, any>>
) => {
  // token 刷新器（可选）
  const { tokenRefresher } = options;
  // 创建服务端 token 鉴权适配：在 onAuthRequired 注入鉴权逻辑，在 onResponseRefreshToken 自动刷新 token
  const { onAuthRequired, onResponseRefreshToken } = createServerTokenAuthentication<
    VueHookType,
    AlovaRequestAdapter<RequestConfig, ResponseType, ResponseHeader>
  >({
    // 成功响应时的刷新策略
    refreshTokenOnSuccess: {
      isExpired: (response, method) => tokenRefresher?.isExpired(response, method) || false,
      handler: async (response, method) => tokenRefresher?.handler(response, method)
    },
    // 错误响应时的刷新策略
    refreshTokenOnError: {
      isExpired: (response, method) => tokenRefresher?.isExpired(response, method) || false,
      handler: async (response, method) => tokenRefresher?.handler(response, method)
    }
  });

  // 创建 Alova 实例
  const instance = createAlova({
    // 合并外部配置
    ...customConfig,
    // 默认超时：10 秒
    timeout: customConfig.timeout ?? 10 * 1000,
    // 默认使用 fetch 适配器（可由 customConfig 覆盖）
    requestAdapter: (customConfig.requestAdapter as any) ?? adapterFetch(),
    // Vue hooks 适配
    statesHook: VueHook,
    // 请求前：注入鉴权（例如 token）并执行外部 onRequest
    beforeRequest: onAuthRequired(options.onRequest as any),
    // 响应处理：支持 token 过期刷新与成功/失败统一转换
    responded: onResponseRefreshToken({
      onSuccess: async (response, method) => {
        // 判断后端是否成功（中文说明：由 options.isBackendSuccess 决定）
        let error: any = null;
        let transformedData: any = null;
        try {
          // 后端成功：转换数据
          if (await options.isBackendSuccess(response)) {
            transformedData = await options.transformBackendResponse(response);
          } else {
            // 后端失败：构造业务错误并标记自定义错误码
            error = new Error('the backend request error');
            error.code = BACKEND_ERROR_CODE;
          }
        } catch (err) {
          // 转换过程异常：按错误处理
          error = err;
        }

        // 失败时执行 onError，并将错误抛出给调用方
        if (error) {
          await options.onError?.(error, response, method);
          throw error;
        }

        // 成功时返回转换后的数据
        return transformedData;
      },
      // 响应完成回调（可选）
      onComplete: options.onComplete,
      // 网络/异常错误回调（无 response）
      onError: (error, method) => options.onError?.(error, null, method)
    })
  });

  // 返回 Alova 实例
  return instance;
};

// 导出常量与类型
export { BACKEND_ERROR_CODE };
export type * from './type';
export type * from 'alova';
