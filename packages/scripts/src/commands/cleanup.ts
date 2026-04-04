import { rimraf } from 'rimraf';

// 清理目录（中文说明：支持 glob 模式批量删除目录，如 node_modules/dist 等）
export async function cleanup(paths: string[]) {
  await rimraf(paths, { glob: true });
}
