import path from 'node:path';
import { readFileSync } from 'node:fs';
import { prompt } from 'enquirer';
import { execCommand } from '../shared';
import { locales } from '../locales';
import type { Lang } from '../locales';

// 交互式输入结果类型（types/scopes/description）
interface PromptObject {
  types: string;
  scopes: string;
  description: string;
}

/**
 * 按 Conventional Commits 规范生成 git commit message 并提交
 *
 * @param lang 文案语言
 */
export async function gitCommit(lang: Lang = 'en-us') {
  // 读取本地化文案与选项
  const { gitCommitMessages, gitCommitTypes, gitCommitScopes } = locales[lang];

  // commit type 选项：格式化显示对齐
  const typesChoices = gitCommitTypes.map(([value, msg]) => {
    const nameWithSuffix = `${value}:`;

    const message = `${nameWithSuffix.padEnd(12)}${msg}`;

    return {
      name: value,
      message
    };
  });

  // scope 选项：展示 scope 与说明
  const scopesChoices = gitCommitScopes.map(([value, msg]) => ({
    name: value,
    message: `${value.padEnd(30)} (${msg})`
  }));

  // 交互式选择 type/scope 并输入描述
  const result = await prompt<PromptObject>([
    {
      name: 'types',
      type: 'select',
      message: gitCommitMessages.types,
      choices: typesChoices
    },
    {
      name: 'scopes',
      type: 'select',
      message: gitCommitMessages.scopes,
      choices: scopesChoices
    },
    {
      name: 'description',
      type: 'text',
      message: gitCommitMessages.description
    }
  ]);

  // 描述以 ! 开头表示 breaking change
  const breaking = result.description.startsWith('!') ? '!' : '';

  // 去除开头 ! 并 trim
  const description = result.description.replace(/^!/, '').trim();

  // 拼接最终提交信息
  const commitMsg = `${result.types}(${result.scopes})${breaking}: ${description}`;

  // 执行 git commit
  await execCommand('git', ['commit', '-m', commitMsg], { stdio: 'inherit' });
}

// 校验 git commit message（中文说明：用于 git hooks 校验提交信息是否符合规范）
export async function gitCommitVerify(lang: Lang = 'en-us', ignores: RegExp[] = []) {
  // 获取 git 根目录路径
  const gitPath = await execCommand('git', ['rev-parse', '--show-toplevel']);

  // commit message 文件路径
  const gitMsgPath = path.join(gitPath, '.git', 'COMMIT_EDITMSG');

  // 读取 commit message
  const commitMsg = readFileSync(gitMsgPath, 'utf8').trim();

  // 命中忽略规则则跳过校验
  if (ignores.some(regExp => regExp.test(commitMsg))) return;

  // Conventional Commits 正则
  const REG_EXP = /(?<type>[a-z]+)(?:\((?<scope>.+)\))?(?<breaking>!)?: (?<description>.+)/i;

  // 不符合规范则抛错，交由上层终止流程
  if (!REG_EXP.test(commitMsg)) {
    const errorMsg = locales[lang].gitCommitVerify;

    throw new Error(errorMsg);
  }
}
