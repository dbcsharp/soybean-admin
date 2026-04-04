import { transformRecordToOption } from '@/utils/common';

// 是/否选项映射（中文说明：用于统一表单/表格中的 YesOrNo 文案）
export const yesOrNoRecord: Record<CommonType.YesOrNo, App.I18n.I18nKey> = {
  // 是
  Y: 'common.yesOrNo.yes',
  // 否
  N: 'common.yesOrNo.no'
  // yesOrNoRecord 对象定义结束
};

// 是/否选项数组（中文说明：由 record 转换得到 { value,label } 列表）
export const yesOrNoOptions = transformRecordToOption(yesOrNoRecord);
