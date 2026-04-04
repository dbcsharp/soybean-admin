// 路由组件标识前缀：布局组件
const LAYOUT_PREFIX = 'layout.';
// 路由组件标识前缀：页面组件
const VIEW_PREFIX = 'view.';
// 一级路由组件分隔符（中文说明：layout 与 view 用 '$' 分隔）
const FIRST_LEVEL_ROUTE_COMPONENT_SPLIT = '$';

// 解析 component 字符串并返回 layout/page（中文说明：支持 'layout.base$view.xxx'、'layout.base'、'view.xxx' 三种形式）
export function getLayoutAndPage(component?: string | null) {
  // 布局名称
  let layout = '';
  // 页面名称
  let page = '';

  // 按分隔符拆分为 layoutOrPage 与 pageItem（pageItem 仅在带 layout 时存在）
  const [layoutOrPage = '', pageItem = ''] = component?.split(FIRST_LEVEL_ROUTE_COMPONENT_SPLIT) || [];

  // 解析布局（不匹配前缀则返回空字符串）
  layout = getLayout(layoutOrPage);
  // 优先使用 pageItem；当没有 pageItem 时，layoutOrPage 可能是 view.xxx
  page = getPage(pageItem || layoutOrPage);

  // 返回解析结果
  return { layout, page };
}

// 从字符串中提取布局名称（中文说明：仅当以 layout. 开头时返回去前缀后的值）
function getLayout(layout: string) {
  return layout.startsWith(LAYOUT_PREFIX) ? layout.replace(LAYOUT_PREFIX, '') : '';
}

// 从字符串中提取页面名称（中文说明：仅当以 view. 开头时返回去前缀后的值）
function getPage(page: string) {
  return page.startsWith(VIEW_PREFIX) ? page.replace(VIEW_PREFIX, '') : '';
}

// 将 layout/page 反向拼装为 component 字符串（中文说明：用于回填路由组件标识）
export function transformLayoutAndPageToComponent(layout: string, page: string) {
  // 是否存在布局
  const hasLayout = Boolean(layout);
  // 是否存在页面
  const hasPage = Boolean(page);

  // 同时存在布局与页面：拼装为 'layout.xxx$view.yyy'
  if (hasLayout && hasPage) {
    return `${LAYOUT_PREFIX}${layout}${FIRST_LEVEL_ROUTE_COMPONENT_SPLIT}${VIEW_PREFIX}${page}`;
  }

  // 仅存在布局：拼装为 'layout.xxx'
  if (hasLayout) {
    return `${LAYOUT_PREFIX}${layout}`;
  }

  // 仅存在页面：拼装为 'view.xxx'
  if (hasPage) {
    return `${VIEW_PREFIX}${page}`;
  }

  // 两者都不存在：返回空字符串
  return '';
}

/**
 * Get route name by route path
 *
 * @param routeName
 */
// 根据路由 name 生成路由 path（中文说明：将 '_' 分隔转换为 '/' 分隔）
export function getRoutePathByRouteName(routeName: string) {
  // 路由 name 使用 '_' 分隔层级，这里转换为 '/' 分隔的 path
  return `/${routeName.replace(/_/g, '/')}`;
}

/**
 * Get path param from route path
 *
 * @param routePath route path
 */
// 从路由 path 中提取动态参数（中文说明：将 '/xxx/:id' 解析为 { path, param }）
export function getPathParamFromRoutePath(routePath: string) {
  // 将 '/a/b/:id' 拆分为 path 与 param
  const [path, param = ''] = routePath.split('/:');

  // 返回基础 path 与 param 名称
  return {
    path,
    param
  };
}

/**
 * Get route path with param
 *
 * @param routePath route path
 * @param param path param
 */
// 为路由 path 拼接动态参数（中文说明：param 非空时追加 '/:param'）
export function getRoutePathWithParam(routePath: string, param: string) {
  // param 非空时追加 '/:param'
  if (param.trim()) {
    return `${routePath}/:${param}`;
  }

  // param 为空则返回原 path
  return routePath;
}
