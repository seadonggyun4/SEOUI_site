import {
  component$,
  Slot,
  PropFunction,
  useSignal,
  useVisibleTask$,
  Resource,
  useResource$,
  $
} from '@builder.io/qwik';
import './style.scss';

interface DocSectionProps {
  title: string;
  description?: string;
  code?: string;
  lang?: string;
  open?: boolean;
  onClick$?: PropFunction<() => void>;
  // 스트리밍 관련 새 옵션들
  enableStreaming?: boolean;
  streamDelay?: number;
  priority?: 'high' | 'medium' | 'low';
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
  ({
    title,
    description,
    code,
    lang = 'ts',
    open = true,
    onClick$,
    enableStreaming = true,
    streamDelay,
    priority = 'medium'
  }) => {
    // 즉시 표시되는 상태들
    const isVisible = useSignal(true);
    const sectionOpen = useSignal(open);

    // 스트리밍으로 로드되는 콘텐츠들
    const descriptionHtml = useSignal('');
    const highlighted = useSignal('');

    // 스트리밍 상태들
    const isDescriptionLoaded = useSignal(!description);
    const isCodeLoaded = useSignal(!code);
    const isComponentsLoaded = useSignal(false);

    // 우선순위에 따른 지연 시간 계산 함수 (더 이상 필요 없음 - 인라인으로 처리)

    // Description을 스트리밍으로 로드
    const descriptionResource = useResource$<string>(async ({ track, cleanup }) => {
      track(() => sectionOpen.value);

      if (!description || !sectionOpen.value) return '';

      const controller = new AbortController();
      cleanup(() => controller.abort());

      try {
        if (enableStreaming) {
          // 인라인으로 지연 시간 계산
          const delay = streamDelay !== undefined ? streamDelay :
                      priority === 'high' ? 0 :
                      priority === 'medium' ? 300 :
                      priority === 'low' ? 800 : 300;

          await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, delay);
            cleanup(() => clearTimeout(timeout));

            controller.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new DOMException('Operation aborted', 'AbortError'));
            });
          });
        }

        if (controller.signal.aborted) {
          throw new DOMException('Operation aborted', 'AbortError');
        }

        const MarkdownIt = (await import('markdown-it')).default;
        const md = new MarkdownIt({ html: true, breaks: true });
        return md.render(dedent(description));
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return '';
        }
        throw new Error(`Markdown 처리 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    });

    // Code highlighting을 스트리밍으로 로드
    const codeResource = useResource$<string>(async ({ track, cleanup }) => {
      track(() => sectionOpen.value);

      if (!code || !sectionOpen.value) return '';

      const controller = new AbortController();
      cleanup(() => controller.abort());

      try {
        if (enableStreaming) {
          // 인라인으로 지연 시간 계산 (코드는 추가 200ms)
          const delay = streamDelay !== undefined ? streamDelay + 200 :
                      priority === 'high' ? 200 :
                      priority === 'medium' ? 500 :
                      priority === 'low' ? 1000 : 500;

          await new Promise((resolve, reject) => {
            const timeout = setTimeout(resolve, delay);
            cleanup(() => clearTimeout(timeout));

            controller.signal.addEventListener('abort', () => {
              clearTimeout(timeout);
              reject(new DOMException('Operation aborted', 'AbortError'));
            });
          });
        }

        if (controller.signal.aborted) {
          throw new DOMException('Operation aborted', 'AbortError');
        }

        const shiki = await import('shiki');
        const highlighter = await shiki.createHighlighter({
          themes: ['nord'],
          langs: ['ts', 'js', 'html', 'css'],
        });

        return highlighter.codeToHtml(dedent(code), {
          lang,
          theme: 'nord',
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return '';
        }
        throw new Error(`코드 하이라이팅 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    });

    // 컴포넌트 영역 스트리밍 (Slot 콘텐츠가 로드된 후 약간의 지연)
    useVisibleTask$(({ cleanup }) => {
      if (!enableStreaming) {
        isComponentsLoaded.value = true;
        return;
      }

      // 인라인으로 지연 시간 계산 (컴포넌트는 추가 100ms)
      const delay = streamDelay !== undefined ? streamDelay + 100 :
                  priority === 'high' ? 100 :
                  priority === 'medium' ? 400 :
                  priority === 'low' ? 900 : 400;

      const timeout = setTimeout(() => {
        isComponentsLoaded.value = true;
      }, delay);

      cleanup(() => clearTimeout(timeout));
    });

    // 코드 복사 핸들러
    const copyCode = $(async () => {
      try {
        await navigator.clipboard.writeText(dedent(code || ''));
        // 복사 성공 피드백 (선택사항)
      } catch (error) {
        console.error('코드 복사 실패:', error);
        // 폴백: 텍스트 선택
        const textArea = document.createElement('textarea');
        textArea.value = dedent(code || '');
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
    });

    // 섹션 토글 핸들러
    const handleToggle = $(() => {
      sectionOpen.value = !sectionOpen.value;
      if (onClick$) {
        onClick$();
      }
    });

    return (
      <details
        class={`docs ${priority}-priority ${enableStreaming ? 'streaming-enabled' : ''}`}
        open={sectionOpen.value}
      >
        <summary onClick$={handleToggle}>
          {title}
          {enableStreaming && (
            <span class="streaming-indicator">
              <i class="fas fa-stream"></i>
            </span>
          )}
        </summary>

        <article class="docs-content">
          {/* Description 영역 - 스트리밍 */}
          {description && (
            <div class="doc-description-wrapper">
              <Resource
                value={descriptionResource}
                onPending={() => (
                  <div class="description-skeleton">
                    <div class="skeleton-line long"></div>
                    <div class="skeleton-line medium"></div>
                    <div class="skeleton-line short"></div>
                  </div>
                )}
                onRejected={(error) => (
                  <div class="description-error">
                    <i class="fas fa-exclamation-triangle error-icon"></i>
                    <div class="error-content">
                      <strong>설명 로드 실패</strong>
                      <span class="error-message">{error.message}</span>
                      <button
                        class="retry-button"
                        onClick$={() => {
                          // 리소스 재시도 트리거
                          sectionOpen.value = false;
                          setTimeout(() => sectionOpen.value = true, 100);
                        }}
                      >
                        <i class="fas fa-redo"></i> 다시 시도
                      </button>
                    </div>
                  </div>
                )}
                onResolved={(html) => (
                  <div
                    class="doc-description loaded"
                    dangerouslySetInnerHTML={html}
                  />
                )}
              />
            </div>
          )}

          {/* Components 영역 - 스트리밍 */}
          <div class="doc-components-wrapper">
            {!isComponentsLoaded.value && enableStreaming ? (
              <div class="components-skeleton">
                <div class="skeleton-components">
                  <div class="skeleton-button">
                    <i class="fas fa-spinner fa-spin"></i>
                  </div>
                  <div class="skeleton-button">
                    <i class="fas fa-spinner fa-spin"></i>
                  </div>
                  <div class="skeleton-button">
                    <i class="fas fa-spinner fa-spin"></i>
                  </div>
                </div>
                <span class="loading-text">컴포넌트 로딩 중...</span>
              </div>
            ) : (
              <div class={`doc-components ${isComponentsLoaded.value ? 'loaded' : ''}`}>
                <Slot />
              </div>
            )}
          </div>

          {/* Code 영역 - 스트리밍 */}
          {code && (
            <div class="doc-code-wrapper">
              <Resource
                value={codeResource}
                onPending={() => (
                  <div class="code-skeleton">
                    <div class="skeleton-code-header">
                      <div class="skeleton-lang-tag">
                        <i class="fas fa-code"></i>
                      </div>
                      <div class="skeleton-copy-btn">
                        <i class="fas fa-spinner fa-spin"></i>
                      </div>
                    </div>
                    <div class="skeleton-code-lines">
                      <div class="skeleton-code-line long"></div>
                      <div class="skeleton-code-line medium"></div>
                      <div class="skeleton-code-line short"></div>
                      <div class="skeleton-code-line long"></div>
                      <div class="skeleton-code-line medium"></div>
                    </div>
                    <div class="loading-text">
                      <i class="fas fa-palette"></i> 코드 하이라이팅 중...
                    </div>
                  </div>
                )}
                onRejected={(error) => (
                  <div class="code-error">
                    <i class="fas fa-exclamation-circle error-icon"></i>
                    <div class="error-content">
                      <strong>코드 하이라이팅 실패</strong>
                      <span class="error-message">{error.message}</span>
                      <div class="error-actions">
                        <button
                          class="retry-button"
                          onClick$={() => {
                            sectionOpen.value = false;
                            setTimeout(() => sectionOpen.value = true, 100);
                          }}
                        >
                          <i class="fas fa-redo"></i> 다시 시도
                        </button>
                        <button
                          class="raw-code-button"
                          onClick$={() => {
                            // 원본 코드 표시
                            const codeElement = document.createElement('pre');
                            codeElement.textContent = dedent(code || '');
                            codeElement.className = 'raw-code';
                            const errorElement = document.querySelector('.code-error');
                            if (errorElement) {
                              errorElement.parentNode?.replaceChild(codeElement, errorElement);
                            }
                          }}
                        >
                          <i class="fas fa-file-code"></i> 원본 코드 보기
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                onResolved={(html) => (
                  <div class="doc-code-container loaded">
                    <div class="code-header">
                      <span class="language-tag">
                        <i class="fas fa-code"></i> {lang.toUpperCase()}
                      </span>
                      <button
                        class="copy-button"
                        onClick$={copyCode}
                      >
                        <i class="fas fa-copy"></i> 복사
                      </button>
                    </div>
                    <div
                      class="doc-code"
                      dangerouslySetInnerHTML={html}
                    />
                  </div>
                )}
              />
            </div>
          )}
        </article>
      </details>
    );
  }
);