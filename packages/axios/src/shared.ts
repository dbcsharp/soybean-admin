import type { AxiosHeaderValue, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ResponseType } from './type';

// 获取 Content-Type（优先取 headers['Content-Type']，否则使用 application/json）
export function getContentType(config: InternalAxiosRequestConfig) {
  const contentType: AxiosHeaderValue = config.headers?.['Content-Type'] || 'application/json';

  return contentType;
}

// 判断 HTTP 状态码是否成功（2xx 与 304 视为成功）
export function isHttpSuccess(status: number) {
  const isSuccessCode = status >= 200 && status < 300;
  return isSuccessCode || status === 304;
}

// 判断响应是否为 JSON（responseType=undefined 或 json 时视为 JSON）
export function isResponseJson(response: AxiosResponse) {
  const { responseType } = response.config;

  return responseType === 'json' || responseType === undefined;
}

// 预处理响应（当 responseType 为 blob/arrayBuffer 且实际 content-type 为 json 时，尝试转换为 JSON）
export async function transformResponse(response: AxiosResponse) {
  const responseType: ResponseType = (response.config?.responseType as ResponseType) || 'json';
  if (responseType === 'json') return;

  const isJson = response.headers['content-type']?.includes('application/json');
  if (!isJson) return;

  if (responseType === 'blob') {
    await transformBlobToJson(response);
  }

  if (responseType === 'arrayBuffer') {
    await transformArrayBufferToJson(response);
  }
}

// 将 blob 响应转换为 JSON（兼容 data 为 string/blob 的情况）
export async function transformBlobToJson(response: AxiosResponse) {
  try {
    let data = response.data;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (Object.prototype.toString.call(data) === '[object Blob]') {
      const json = await data.text();
      data = JSON.parse(json);
    }

    response.data = data;
  } catch {}
}

// 将 arrayBuffer 响应转换为 JSON（兼容 data 为 string/ArrayBuffer 的情况）
export async function transformArrayBufferToJson(response: AxiosResponse) {
  try {
    let data = response.data;

    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    if (Object.prototype.toString.call(data) === '[object ArrayBuffer]') {
      const json = new TextDecoder().decode(data);
      data = JSON.parse(json);
    }

    response.data = data;
  } catch {}
}
