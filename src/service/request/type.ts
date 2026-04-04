// 请求实例状态类型：用于在请求层保存刷新 token Promise 与错误消息栈等共享状态
export interface RequestInstanceState {
  /** the promise of refreshing token */
  // 刷新 token 的 Promise（中文说明：用于并发请求时复用同一次刷新，避免重复刷新）
  refreshTokenPromise: Promise<boolean> | null;
  /** the request error message stack */
  // 错误消息栈（中文说明：用于去重弹窗/提示，避免重复提示同一错误）
  errMsgStack: string[];
  // 扩展字段（中文说明：允许在实例状态上挂载额外数据）
  [key: string]: unknown;
  // RequestInstanceState 接口定义结束
}
