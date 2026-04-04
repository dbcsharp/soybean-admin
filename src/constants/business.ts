import { transformRecordToOption } from '@/utils/common';

// 业务常量：将后端枚举值映射为 i18n key，并生成下拉选项数组
export const enableStatusRecord: Record<Api.Common.EnableStatus, App.I18n.I18nKey> = {
  // 启用
  '1': 'page.manage.common.status.enable',
  // 禁用
  '2': 'page.manage.common.status.disable'
  // enableStatusRecord 对象定义结束
};

// 启用状态选项数组
export const enableStatusOptions = transformRecordToOption(enableStatusRecord);

// 用户性别映射（将性别枚举值映射为 i18n key）
export const userGenderRecord: Record<Api.SystemManage.UserGender, App.I18n.I18nKey> = {
  // 男
  '1': 'page.manage.user.gender.male',
  // 女
  '2': 'page.manage.user.gender.female'
  // userGenderRecord 对象定义结束
};

// 用户性别选项数组
export const userGenderOptions = transformRecordToOption(userGenderRecord);

// 菜单类型映射（目录/菜单）
export const menuTypeRecord: Record<Api.SystemManage.MenuType, App.I18n.I18nKey> = {
  // 目录
  '1': 'page.manage.menu.type.directory',
  // 菜单
  '2': 'page.manage.menu.type.menu'
  // menuTypeRecord 对象定义结束
};

// 菜单类型选项数组
export const menuTypeOptions = transformRecordToOption(menuTypeRecord);

// 菜单图标类型映射（Iconify 图标/本地图标）
export const menuIconTypeRecord: Record<Api.SystemManage.IconType, App.I18n.I18nKey> = {
  // Iconify 图标
  '1': 'page.manage.menu.iconType.iconify',
  // 本地图标
  '2': 'page.manage.menu.iconType.local'
  // menuIconTypeRecord 对象定义结束
};

// 菜单图标类型选项数组
export const menuIconTypeOptions = transformRecordToOption(menuIconTypeRecord);
