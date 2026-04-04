// @unocss-include

import type { Preset } from '@unocss/core';
import type { Theme } from '@unocss/preset-mini';

// UnoCSS 预设：提供项目常用 shortcuts（flex/absolute/fixed/ellipsis 等）
export function presetSoybeanAdmin(): Preset<Theme> {
  // 预设对象
  const preset: Preset<Theme> = {
    // 预设名称
    name: 'preset-soybean-admin',
    // 快捷类集合（shortcuts）
    shortcuts: [
      {
        'flex-center': 'flex justify-center items-center',
        'flex-x-center': 'flex justify-center',
        'flex-y-center': 'flex items-center',
        'flex-col': 'flex flex-col',
        'flex-col-center': 'flex-center flex-col',
        'flex-col-stretch': 'flex-col items-stretch',
        'i-flex-center': 'inline-flex justify-center items-center',
        'i-flex-x-center': 'inline-flex justify-center',
        'i-flex-y-center': 'inline-flex items-center',
        'i-flex-col': 'flex-col inline-flex',
        'i-flex-col-center': 'flex-col i-flex-center',
        'i-flex-col-stretch': 'i-flex-col items-stretch',
        'flex-1-hidden': 'flex-1 overflow-hidden'
      },
      {
        'absolute-lt': 'absolute left-0 top-0',
        'absolute-lb': 'absolute left-0 bottom-0',
        'absolute-rt': 'absolute right-0 top-0',
        'absolute-rb': 'absolute right-0 bottom-0',
        'absolute-tl': 'absolute-lt',
        'absolute-tr': 'absolute-rt',
        'absolute-bl': 'absolute-lb',
        'absolute-br': 'absolute-rb',
        'absolute-center': 'absolute-lt flex-center size-full',
        'fixed-lt': 'fixed left-0 top-0',
        'fixed-lb': 'fixed left-0 bottom-0',
        'fixed-rt': 'fixed right-0 top-0',
        'fixed-rb': 'fixed right-0 bottom-0',
        'fixed-tl': 'fixed-lt',
        'fixed-tr': 'fixed-rt',
        'fixed-bl': 'fixed-lb',
        'fixed-br': 'fixed-rb',
        'fixed-center': 'fixed-lt flex-center size-full'
      },
      {
        'nowrap-hidden': 'overflow-hidden whitespace-nowrap',
        'ellipsis-text': 'nowrap-hidden text-ellipsis'
      }
    ]
  };

  // 返回预设
  return preset;
}

// 默认导出：便于直接在 uno.config.ts 中使用
export default presetSoybeanAdmin;
