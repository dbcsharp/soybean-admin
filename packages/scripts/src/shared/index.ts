import type { Options } from 'execa';

// 执行命令并返回 stdout（中文说明：通过动态 import execa 避免 ESM/CJS 兼容问题）
export async function execCommand(cmd: string, args: string[], options?: Options) {
  // 动态导入 execa
  const { execa } = await import('execa');
  // 执行命令
  const res = await execa(cmd, args, options);
  // 返回 stdout（去除首尾空白）
  return (res?.stdout as string)?.trim() || '';
}
