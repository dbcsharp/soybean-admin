// StoreId 枚举：用于 Pinia setupStore 时区分不同模块的 store id
export enum SetupStoreId {
  // 应用状态 store
  App = 'app-store',
  // 主题状态 store
  Theme = 'theme-store',
  // 鉴权状态 store
  Auth = 'auth-store',
  // 路由状态 store
  Route = 'route-store',
  // 标签页状态 store
  Tab = 'tab-store'
}
