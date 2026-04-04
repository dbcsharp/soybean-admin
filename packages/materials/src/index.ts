import AdminLayout, { LAYOUT_MAX_Z_INDEX, LAYOUT_SCROLL_EL_ID } from './libs/admin-layout';
import PageTab from './libs/page-tab';
import SimpleScrollbar from './libs/simple-scrollbar';

// Materials 包入口：导出布局组件、标签页组件与滚动条组件
export { AdminLayout, LAYOUT_SCROLL_EL_ID, LAYOUT_MAX_Z_INDEX, PageTab, SimpleScrollbar };
// 导出类型定义
export * from './types';
