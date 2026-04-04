import { generateChangelog, generateTotalChangelog } from '@soybeanjs/changelog';
import type { ChangelogOption } from '@soybeanjs/changelog';

// 生成 changelog（中文说明：total=true 时按全量 tag 生成，否则生成增量 changelog）
export async function genChangelog(options?: Partial<ChangelogOption>, total = false) {
  if (total) {
    await generateTotalChangelog(options);
  } else {
    await generateChangelog(options);
  }
}
