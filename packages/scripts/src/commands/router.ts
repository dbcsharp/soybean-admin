import process from 'node:process';
import path from 'node:path';
import { writeFile } from 'node:fs/promises';
import { existsSync, mkdirSync } from 'node:fs';
import { prompt } from 'enquirer';
import { green, red } from 'kolorist';

// 交互式输入结果类型
interface PromptObject {
  routeName: string;
  addRouteParams: boolean;
  routeParams: string;
}

// 生成路由页面文件（中文说明：按约定在 src/views 下创建目录与 index.vue/[param].vue）
export async function generateRoute() {
  // 交互式输入路由名称与是否添加 params
  const result = await prompt<PromptObject>([
    {
      name: 'routeName',
      type: 'text',
      message: 'please enter route name',
      initial: 'demo-route_child'
    },
    {
      name: 'addRouteParams',
      type: 'confirm',
      message: 'add route params?',
      initial: false
    }
  ]);

  // 需要 params 时继续询问 params 名称
  if (result.addRouteParams) {
    const answers = await prompt<PromptObject>({
      name: 'routeParams',
      type: 'text',
      message: 'please enter route params',
      initial: 'id'
    });

    Object.assign(result, answers);
  }

  // 路由目录名称校验（允许字母/数字/_/-）
  const PAGE_DIR_NAME_PATTERN = /^[\w-]+[0-9a-zA-Z]+$/;

  if (!PAGE_DIR_NAME_PATTERN.test(result.routeName)) {
    throw new Error(`${red('route name is invalid, it only allow letters, numbers, "-" or "_"')}.
For example:
(1) one level route: ${green('demo-route')}
(2) two level route: ${green('demo-route_child')}
(3) multi level route: ${green('demo-route_child_child')}
(4) group route: ${green('_ignore_demo-route')}'
`);
  }

  // params 校验（仅允许字母/数字/_）
  const PARAM_REG = /^\w+$/g;

  if (result.routeParams && !PARAM_REG.test(result.routeParams)) {
    throw new Error(red('route params is invalid, it only allow letters, numbers or "_".'));
  }

  // 获取当前工作目录
  const cwd = process.cwd();

  // 按 '_' 分割层级：第一级为 src/views/<dir>，剩余部分拼成子目录
  const [dir, ...rest] = result.routeName.split('_') as string[];

  let routeDir = path.join(cwd, 'src', 'views', dir);

  if (rest.length) {
    routeDir = path.join(routeDir, rest.join('_'));
  }

  // 目录不存在则创建；存在则报错避免覆盖
  if (!existsSync(routeDir)) {
    mkdirSync(routeDir, { recursive: true });
  } else {
    throw new Error(red('route already exists'));
  }

  // 文件名：有 params 则用动态路由文件名，否则为 index.vue
  const fileName = result.routeParams ? `[${result.routeParams}].vue` : 'index.vue';

  // Vue 文件模板
  const vueTemplate = `<script setup lang="ts"></script>

<template>
  <div>${result.routeName}</div>
</template>

<style scoped></style>
`;

  // 输出文件路径
  const filePath = path.join(routeDir, fileName);

  // 写入文件
  await writeFile(filePath, vueTemplate);
}
