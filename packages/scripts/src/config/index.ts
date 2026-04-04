import process from 'node:process';
import { loadConfig } from 'c12';
import type { CliOption } from '../types';

// CLI 默认配置（支持 cleanup/update-pkg/changelog/git-commit-verify 等命令的默认参数）
const defaultOptions: CliOption = {
  cwd: process.cwd(),
  cleanupDirs: [
    '**/dist',
    '**/package-lock.json',
    '**/yarn.lock',
    '**/pnpm-lock.yaml',
    '**/node_modules',
    '!node_modules/**'
  ],
  ncuCommandArgs: ['--deep', '-u'],
  changelogOptions: {},
  gitCommitVerifyIgnores: [
    /^((Merge pull request)|(Merge (.*?) into (.*?)|(Merge branch (.*?)))(?:\r?\n)*$)/m,
    /^(Merge tag (.*?))(?:\r?\n)*$/m,
    /^(R|r)evert (.*)/,
    /^(amend|fixup|squash)!/,
    /^(Merged (.*?)(in|into) (.*)|Merged PR (.*): (.*))/,
    /^Merge remote-tracking branch(\s*)(.*)/,
    /^Automatic merge(.*)/,
    /^Auto-merged (.*?) into (.*)/
  ]
};

// 加载 CLI 配置（优先读取 c12 配置/包内配置，并可通过 overrides 覆写）
export async function loadCliOptions(overrides?: Partial<CliOption>, cwd = process.cwd()) {
  const { config } = await loadConfig<Partial<CliOption>>({
    name: 'soybean',
    defaults: defaultOptions,
    overrides,
    cwd,
    packageJson: true
  });

  return config as CliOption;
}
