import { execCommand } from '../shared';

// 更新依赖版本（基于 npm-check-updates 扫描并升级 package.json 依赖）
export async function updatePkg(args: string[] = ['--deep', '-u']) {
  execCommand('npx', ['npm-check-updates', ...args], { stdio: 'inherit' });
}
