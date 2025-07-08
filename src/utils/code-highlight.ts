// utils/highlight-code.ts
let _highlighter: any;

export async function highlightCode(code: string, lang: string = 'ts') {
  if (!_highlighter) {
    const shiki = await import('shiki');
    _highlighter = await shiki.createHighlighter({ themes: ['nord'], langs: [lang] });
  }

  return _highlighter.codeToHtml(code, { lang, theme: 'nord' });
}
