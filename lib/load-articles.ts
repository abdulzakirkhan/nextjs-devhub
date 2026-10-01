import { readFileSync } from 'fs';
import { join } from 'path';

export function loadArticleContent(slug: string): string {
  const filePath = join(process.cwd(), 'content', 'articles', `${slug}.md`);
  return readFileSync(filePath, 'utf-8').replace(/^# [^\r\n]*\r?\n(?:\r?\n)?/, '');
}
