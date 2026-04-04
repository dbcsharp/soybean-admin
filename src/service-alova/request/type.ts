// 请求实例状态类型：用于在请求层保存错误消息栈等共享状态（Alova 版本）
export interface RequestInstanceState {
  /** the request error message stack */
  // 错误消息栈（中文说明：用于去重弹窗/提示，避免重复提示同一错误）
  errMsgStack: string[];
  // RequestInstanceState 接口定义结束
}
