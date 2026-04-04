// 系统管理接口（Alova 版本）：角色、用户、菜单等管理相关数据获取与增删改
import { alova } from '../request';

/** get role list */
// 获取角色列表（中文说明：支持按条件分页/筛选）
export function fetchGetRoleList(params?: Api.SystemManage.RoleSearchParams) {
  // 发起 GET 请求到 /systemManage/getRoleList，并携带查询参数
  return alova.Get<Api.SystemManage.RoleList>('/systemManage/getRoleList', { params });
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
  return alova.Get<Api.SystemManage.AllRole[]>('/systemManage/getAllRoles');
  // fetchGetAllRoles 函数结束
}

/** get user list */
// 获取用户列表（中文说明：支持按条件分页/筛选）
export function fetchGetUserList(params?: Api.SystemManage.UserSearchParams) {
  // 发起 GET 请求到 /systemManage/getUserList，并携带查询参数
  return alova.Get<Api.SystemManage.UserList>('/systemManage/getUserList', { params });
  // fetchGetUserList 函数结束
}

// 用户编辑模型（中文说明：仅包含用户新增/编辑需要的字段）
export type UserModel = Pick<
  Api.SystemManage.User,
  'userName' | 'userGender' | 'nickName' | 'userPhone' | 'userEmail' | 'userRoles' | 'status'
>;
/** add user */
// 新增用户（中文说明：提交用户模型数据）
export function addUser(data: UserModel) {
  // 发起 POST 请求到 /systemManage/addUser
  return alova.Post<null>('/systemManage/addUser', data);
  // addUser 函数结束
}

/** update user */
// 更新用户（中文说明：提交用户模型数据）
export function updateUser(data: UserModel) {
  // 发起 POST 请求到 /systemManage/updateUser
  return alova.Post<null>('/systemManage/updateUser', data);
  // updateUser 函数结束
}

/** delete user */
// 删除用户（中文说明：按 id 删除单个用户）
export function deleteUser(id: number) {
  // 发起 DELETE 请求到 /systemManage/deleteUser，并携带 id
  return alova.Delete<null>('/systemManage/deleteUser', { id });
  // deleteUser 函数结束
}

/** batch delete user */
// 批量删除用户（中文说明：按 ids 批量删除）
export function batchDeleteUser(ids: number[]) {
  // 发起 DELETE 请求到 /systemManage/batchDeleteUser，并携带 ids
  return alova.Delete<null>('/systemManage/batchDeleteUser', { ids });
  // batchDeleteUser 函数结束
}

/** get menu list */
// 获取菜单列表（中文说明：返回菜单列表数据，用于菜单管理）
export function fetchGetMenuList() {
  // 发起 GET 请求到 /systemManage/getMenuList/v2
  return alova.Get<Api.SystemManage.MenuList>('/systemManage/getMenuList/v2');
  // fetchGetMenuList 函数结束
}

/** get all pages */
// 获取所有页面路径（中文说明：用于菜单/权限配置时选择页面）
export function fetchGetAllPages() {
  // 发起 GET 请求到 /systemManage/getAllPages
  return alova.Get<string[]>('/systemManage/getAllPages');
  // fetchGetAllPages 函数结束
}

/** get menu tree */
// 获取菜单树（中文说明：返回树形结构的菜单，用于授权/展示）
export function fetchGetMenuTree() {
  // 发起 GET 请求到 /systemManage/getMenuTree
  return alova.Get<Api.SystemManage.MenuTree[]>('/systemManage/getMenuTree');
  // fetchGetMenuTree 函数结束
}
