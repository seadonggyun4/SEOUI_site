import { component$, Slot, PropFunction, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import './style.scss';

interface DocSectionProps {
  title: string;
  description?: string;
  code?: string;
  lang?: string;
  open?: boolean;
  onClick$?: PropFunction<() => void>;
}

// 들여쓰기 제거
function dedent(text: string): string {
  const lines = text.replace(/^\n/, '').split('\n');
  const minIndent = lines
    .filter((line) => line.trim().length > 0)
    .reduce((min, line) => {
      const match = line.match(/^(\s+)/);
      const indent = match ? match[1].length : 0;
      return min === null ? indent : Math.min(min, indent);
    }, null as number | null);

  if (minIndent === null || minIndent === 0) return text;
  return lines.map((line) => line.slice(minIndent)).join('\n');
}

export const DocSection = component$<DocSectionProps>(
  ({ title, description, code, lang = 'ts', open = true, onClick$ }) => {
    const descriptionHtml = useSignal('');
    const highlighted = useSignal('');

    useVisibleTask$(async () => {
      // description (Markdown-it)
      if (description) {
        const MarkdownIt = (await import('markdown-it')).default;
        const md = new MarkdownIt({ html: true, breaks: true });
        descriptionHtml.value = md.render(dedent(description));
      }

      // code (Shiki highlight)
      if (code) {
        const shiki = await import('shiki');
        const highlighter = await shiki.createHighlighter({
          themes: ['nord'],
          langs: ['ts', 'js', 'html', 'css'],
        });

        highlighted.value = highlighter.codeToHtml(dedent(code), {
          lang,
          theme: 'nord',
        });
      }
    });

    return (
      <details class="docs" open={open}>
        <summary onClick$={onClick$}>{title}</summary>
        <article class="docs-content">
          {description && (
            <div
              class="doc-description"
              dangerouslySetInnerHTML={descriptionHtml.value}
            />
          )}

          <div class="doc-components">
            <Slot />
          </div>

          {code && (
            <div class="doc-code" dangerouslySetInnerHTML={highlighted.value} />
          )}
        </article>
      </details>
    );
  }
);