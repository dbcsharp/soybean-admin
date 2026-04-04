import type { ChangelogOption } from '@soybeanjs/changelog';

export interface CliOption {
  /** 项目根目录 */
  cwd: string;
  /**
   * 清理目录列表
   *
   * Glob 语法参考 {@link https://github.com/isaacs/minimatch}
   *
   * @default
   * ```json
   * ["** /dist", "** /pnpm-lock.yaml", "** /node_modules", "!node_modules/**"]
   * ```
   */
  cleanupDirs: string[];
  /**
   * npm-check-updates 命令参数
   *
   * @default ['--deep', '-u']
   */
  ncuCommandArgs: string[];
  /**
   * changelog 生成配置
   *
   * @link https://github.com/soybeanjs/changelog
   */
  changelogOptions: Partial<ChangelogOption>;
  /** git commit message 校验的忽略规则列表 */
  gitCommitVerifyIgnores: RegExp[];
}
