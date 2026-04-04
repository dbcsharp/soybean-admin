// 系统管理接口：角色、用户、菜单等管理相关数据获取
import { request } from '../request';

/** get role list */
// 获取角色列表（中文说明：支持按条件分页/筛选）
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  // 发起 GET 请求到 /systemManage/getRoleList，并携带查询参数
  return request<Api.SystemManage.RoleList>({
    // 接口地址
    url: '/systemManage/getRoleList',
    // 请求方法
    method: 'get',
    // 查询参数
    params
    // request 配置对象结束
  });
  // fetchGetRoleList 函数结束
}

/**
 * get all roles
 *
 * these roles are all enabled
 */
// 获取所有可用角色（中文说明：返回系统中启用状态的角色列表）
export function fetchGetAllRoles() {
  // 发起 GET 请求到 /systemManage/getAllRoles
  return request<Api.SystemManage.AllRole[]>({
    // 接口地址
    url: '/systemManage/getAllRoles',
    // 请求方法
    method: 'get'
    // request 配置对象结束
  });
  // fetchGetAllRoles 函数结束
}

/** get user list */
// 获取用户列表（中文说明：支持按条件分页/筛选）
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  // 发起 GET 请求到 /systemManage/getUserList，并携带查询参数
  return request<Api.SystemManage.UserList>({
    // 接口地址
    url: '/systemManage/getUserList',
    // 请求方法
    method: 'get',
    // 查询参数
    params
    // request 配置对象结束
  });
  // fetchGetUserList 函数结束
}

/** get menu list */
// 获取菜单列表（中文说明：返回菜单列表数据，用于菜单管理）
export function fetchGetMenuList() {
  // 发起 GET 请求到 /systemManage/getMenuList/v2
  return request<Api.SystemManage.MenuList>({
    // 接口地址
    url: '/systemManage/getMenuList/v2',
    // 请求方法
    method: 'get'
    // request 配置对象结束
  });
  // fetchGetMenuList 函数结束
}

/** get all pages */
// 获取所有页面路径（中文说明：用于菜单/权限配置时选择页面）
export function fetchGetAllPages() {
  // 发起 GET 请求到 /systemManage/getAllPages
  return request<string[]>({
    // 接口地址
    url: '/systemManage/getAllPages',
    // 请求方法
    method: 'get'
    // request 配置对象结束
  });
  // fetchGetAllPages 函数结束
}

/** get menu tree */
// 获取菜单树（中文说明：返回树形结构的菜单，用于授权/展示）
export function fetchGetMenuTree() {
  // 发起 GET 请求到 /systemManage/getMenuTree
  return request<Api.SystemManage.MenuTree[]>({
    // 接口地址
    url: '/systemManage/getMenuTree',
    // 请求方法
    method: 'get'
    // request 配置对象结束
  });
  // fetchGetMenuTree 函数结束
}
