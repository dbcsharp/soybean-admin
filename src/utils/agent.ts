// 终端判断工具：根据 UserAgent 判断当前是否为 PC 环境
export function isPC() {
  // 常见移动端设备/系统的 UserAgent 关键字列表
  const agents = ['Android', 'iPhone', 'webOS', 'BlackBerry', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];

  // 判断是否命中任意移动端关键字
  const isMobile = agents.some(agent => window.navigator.userAgent.includes(agent));

  // PC 环境即非移动端环境
  return !isMobile;
}
