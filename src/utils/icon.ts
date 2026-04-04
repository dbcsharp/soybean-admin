// 图标工具：读取本地 svg-icon 目录并返回图标名称列表
export function getLocalIcons() {
  // 通过 Vite 的 glob 导入获取 svg 图标模块映射
  const svgIcons = import.meta.glob('/src/assets/svg-icon/*.svg');

  // 提取所有模块路径的文件名，并去除 .svg 后缀得到图标 key
  const keys = Object.keys(svgIcons)
    // 将路径按 / 分割后取最后一段文件名，并移除扩展名
    .map(item => item.split('/').at(-1)?.replace('.svg', '') || '')
    // 过滤掉空字符串，确保 key 有效
    .filter(Boolean);

  // 返回最终图标 key 列表
  return keys;
  // getLocalIcons 函数结束
}
