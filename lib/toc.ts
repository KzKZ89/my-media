export type TocItem = {
  id: string;
  text: string;
  level: number;
};

export function extractToc(html: string): TocItem[] {
  const regex = /<h([2-3])\s*(?:[^>]*id="([^"]*)")?[^>]*>(.*?)<\/h[2-3]>/gi;
  const items: TocItem[] = [];
  let match;

  while ((match = regex.exec(html)) !== null) {
    const level = parseInt(match[1], 10);
    const text = match[3].replace(/<[^>]*>/g, '').trim();
    const id =
      match[2] ||
      text
        .toLowerCase()
        .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, '-')
        .replace(/^-|-$/g, '');

    items.push({ id, text, level });
  }

  return items;
}

export function injectHeadingIds(html: string): string {
  const regex = /<h([2-3])(\s[^>]*)?>(.*?)<\/h[2-3]>/gi;
  return html.replace(regex, (_match, level, attrs, content) => {
    const text = content.replace(/<[^>]*>/g, '').trim();
    const id = text
      .toLowerCase()
      .replace(/[^\w\u3000-\u9fff\uff00-\uffef]+/g, '-')
      .replace(/^-|-$/g, '');
    const existingAttrs = attrs || '';
    if (/id="/.test(existingAttrs)) {
      return `<h${level}${existingAttrs}>${content}</h${level}>`;
    }
    return `<h${level}${existingAttrs} id="${id}">${content}</h${level}>`;
  });
}
