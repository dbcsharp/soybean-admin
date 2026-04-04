import { versionBump } from 'bumpp';

// 发布流程（中文说明：使用 bumpp 更新版本号、生成 changelog、打 tag 并可选 push）
export async function release(execute = 'pnpm sa changelog', push = true) {
  await versionBump({
    files: ['**/package.json', '!**/node_modules'],
    execute,
    all: true,
    tag: true,
    commit: 'chore(projects): release v%s',
    push
  });
}
