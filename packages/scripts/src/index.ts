import { cac } from 'cac';
import { blue, lightGreen } from 'kolorist';
import { version } from '../package.json';
import { cleanup, genChangelog, generateRoute, gitCommit, gitCommitVerify, release, updatePkg } from './commands';
import { loadCliOptions } from './config';
import type { Lang } from './locales';

// CLI 命令类型（中文说明：soybean-admin 脚手架工具支持的子命令）
type Command = 'cleanup' | 'update-pkg' | 'git-commit' | 'git-commit-verify' | 'changelog' | 'release' | 'gen-route';

// 命令 action 类型
type CommandAction<A extends object> = (args?: A) => Promise<void> | void;

// 命令表结构：command -> { desc, action }
type CommandWithAction<A extends object = object> = Record<Command, { desc: string; action: CommandAction<A> }>;

// CLI 参数类型（中文说明：cac 会把 option 注入到 args）
interface CommandArg {
  /** 发布流程中：版本号更新后、git commit 前执行的额外命令 */
  execute?: string;
  /** 是否推送 git commit 与 tag */
  push?: boolean;
  /** 是否按全量 tag 生成 changelog */
  total?: boolean;
  /**
   * 清理目录的 glob 模式
   *
   * 未设置时使用默认值
   *
   * 多个值用 "," 分隔
   */
  cleanupDir?: string;
  /**
   * CLI 展示语言
   *
   * @default en-us
   */
  lang?: Lang;
}

// 启动 CLI（中文说明：注册命令与选项并解析 argv）
export async function setupCli() {
  const cliOptions = await loadCliOptions();

  const cli = cac(blue('soybean-admin'));

  cli
    .version(lightGreen(version))
    .option(
      '-e, --execute [command]',
      "Execute additional command after bumping and before git commit. Defaults to 'npx soy changelog'"
    )
    .option('-p, --push', 'Indicates whether to push the git commit and tag')
    .option('-t, --total', 'Generate changelog by total tags')
    .option(
      '-c, --cleanupDir <dir>',
      'The glob pattern of dirs to cleanup, If not set, it will use the default value, Multiple values use "," to separate them'
    )
    .option('-l, --lang <lang>', 'display lang of cli', { default: 'en-us', type: [String] })
    .help();

  const commands: CommandWithAction<CommandArg> = {
    cleanup: {
      desc: 'delete dirs: node_modules, dist, etc.',
      action: async () => {
        await cleanup(cliOptions.cleanupDirs);
      }
    },
    'update-pkg': {
      desc: 'update package.json dependencies versions',
      action: async () => {
        await updatePkg(cliOptions.ncuCommandArgs);
      }
    },
    'git-commit': {
      desc: 'git commit, generate commit message which match Conventional Commits standard',
      action: async args => {
        await gitCommit(args?.lang);
      }
    },
    'git-commit-verify': {
      desc: 'verify git commit message, make sure it match Conventional Commits standard',
      action: async args => {
        await gitCommitVerify(args?.lang, cliOptions.gitCommitVerifyIgnores);
      }
    },
    changelog: {
      desc: 'generate changelog',
      action: async args => {
        await genChangelog(cliOptions.changelogOptions, args?.total);
      }
    },
    release: {
      desc: 'release: update version, generate changelog, commit code',
      action: async args => {
        await release(args?.execute, args?.push);
      }
    },
    'gen-route': {
      desc: 'generate route',
      action: async () => {
        await generateRoute();
      }
    }
  };

  for (const [command, { desc, action }] of Object.entries(commands)) {
    cli.command(command, lightGreen(desc)).action(action);
  }

  cli.parse();
}

// 直接启动 CLI
setupCli();
