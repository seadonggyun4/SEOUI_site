import {
  component$,
  Slot,
  PropFunction,
  useSignal,
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
  // 컴포넌트 로딩 관련 새 옵션들
  waitForComponents?: string[]; // 대기할 custom element 이름들
  componentTimeout?: number; // 컴포넌트 로딩 타임아웃 (ms)
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
    priority = 'medium',
    waitForComponents = [],
    componentTimeout = 10000
  }) => {
    const sectionOpen = useSignal(open);
    const isComponentsLoaded = useSignal(false);
    const componentLoadingError = useSignal<string | null>(null);

    // Description을 스트리밍으로 로드
    const descriptionResource = useResource$<string>(async ({ track, cleanup }) => {
      track(() => sectionOpen.value);

      if (!description || !sectionOpen.value) return '';

      const controller = new AbortController();
      cleanup(() => controller.abort());

      try {
        if (enableStreaming) {
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

    // 컴포넌트 로딩 상태를 실제로 추적하는 Resource
    const componentResource = useResource$<boolean>(async ({ track, cleanup }) => {
      track(() => sectionOpen.value);
      track(() => waitForComponents.length);

      if (!sectionOpen.value) return false;

      // 대기할 컴포넌트가 없으면 즉시 로딩 완료
      if (waitForComponents.length === 0) {
        if (!enableStreaming) return true;

        // 기본 지연 시간만 적용
        const delay = streamDelay !== undefined ? streamDelay + 100 :
                    priority === 'high' ? 100 :
                    priority === 'medium' ? 400 :
                    priority === 'low' ? 900 : 400;

        await new Promise(resolve => setTimeout(resolve, delay));
        return true;
      }

      const controller = new AbortController();
      cleanup(() => controller.abort());

      try {
        // 각 컴포넌트가 정의될 때까지 대기
        const componentPromises = waitForComponents.map(async (componentName) => {
          // 이미 정의된 컴포넌트는 즉시 해결
          if (customElements.get(componentName)) {
            return true;
          }

          // 컴포넌트 정의 대기 (타임아웃 포함)
          const definedPromise = customElements.whenDefined(componentName);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error(`${componentName} 로딩 타임아웃`)), componentTimeout)
          );

          const abortPromise = new Promise((_, reject) => {
            controller.signal.addEventListener('abort', () => {
              reject(new DOMException('Operation aborted', 'AbortError'));
            });
          });

          await Promise.race([definedPromise, timeoutPromise, abortPromise]);
          return true;
        });

        await Promise.all(componentPromises);

        if (controller.signal.aborted) {
          throw new DOMException('Operation aborted', 'AbortError');
        }

        // 모든 컴포넌트가 정의된 후 DOM 업데이트 대기
        await new Promise(resolve => requestAnimationFrame(resolve));

        // 실제 DOM 엘리먼트들이 업그레이드될 때까지 대기
        const elementCheckPromises = waitForComponents.map(async (componentName) => {
          const elements = document.querySelectorAll(componentName);
          if (elements.length === 0) return true;

          // 각 엘리먼트가 업그레이드될 때까지 대기
          const upgradePromises = Array.from(elements).map(async (element) => {
            // HTMLElement 타입 가드 및 constructor 체크
            if (!(element instanceof HTMLElement) || element.constructor !== HTMLElement) {
              return true; // 이미 업그레이드됨
            }

            // 업그레이드 대기 (폴링 방식)
            let attempts = 0;
            const maxAttempts = 50; // 5초 최대 대기

            while (element instanceof HTMLElement && element.constructor === HTMLElement && attempts < maxAttempts) {
              if (controller.signal.aborted) {
                throw new DOMException('Operation aborted', 'AbortError');
              }

              await new Promise(resolve => setTimeout(resolve, 100));
              attempts++;
            }

            return !(element instanceof HTMLElement && element.constructor === HTMLElement);
          });

          await Promise.all(upgradePromises);
          return true;
        });

        await Promise.all(elementCheckPromises);
        return true;

      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return false;
        }
        throw error;
      }
    });

    // 컴포넌트 재시도 핸들러
    const retryComponentLoading = $(() => {
      componentLoadingError.value = null;
      // Resource 재시도를 위해 섹션을 닫았다가 다시 열기
      sectionOpen.value = false;
      setTimeout(() => sectionOpen.value = true, 100);
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
          {waitForComponents.length > 0 && (
            <span class="component-indicator" title={`대기 중인 컴포넌트: ${waitForComponents.join(', ')}`}>
              <i class="fas fa-puzzle-piece"></i>
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

          {/* Components 영역 - 실제 컴포넌트 로딩 상태 기반 스트리밍 */}
          <div class="doc-components-wrapper">
            <Resource
              value={componentResource}
              onPending={() => (
                <div class="components-skeleton">
                  <div class="skeleton-components">
                    {waitForComponents.map((componentName) => (
                      <div key={componentName} class="skeleton-component" title={`${componentName} 로딩 중`}>
                        <i class="fas fa-spinner fa-spin"></i>
                        <span class="component-name">{componentName}</span>
                      </div>
                    ))}
                    {waitForComponents.length === 0 && (
                      <>
                        <div class="skeleton-button">
                          <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <div class="skeleton-button">
                          <i class="fas fa-spinner fa-spin"></i>
                        </div>
                        <div class="skeleton-button">
                          <i class="fas fa-spinner fa-spin"></i>
                        </div>
                      </>
                    )}
                  </div>
                  <span class="loading-text">
                    {waitForComponents.length > 0
                      ? `컴포넌트 로딩 중: ${waitForComponents.join(', ')}`
                      : '컴포넌트 로딩 중...'
                    }
                  </span>
                </div>
              )}
              onRejected={(error) => (
                <div class="components-error">
                  <i class="fas fa-exclamation-circle error-icon"></i>
                  <div class="error-content">
                    <strong>컴포넌트 로딩 실패</strong>
                    <span class="error-message">{error.message}</span>
                    <div class="error-actions">
                      <button class="retry-button" onClick$={retryComponentLoading}>
                        <i class="fas fa-redo"></i> 다시 시도
                      </button>
                      <button
                        class="skip-button"
                        onClick$={() => {
                          isComponentsLoaded.value = true;
                          componentLoadingError.value = null;
                        }}
                      >
                        <i class="fas fa-forward"></i> 건너뛰기
                      </button>
                    </div>
                  </div>
                </div>
              )}
              onResolved={(loaded) => (
                <div class={`doc-components ${loaded ? 'loaded' : ''}`}>
                  <Slot />
                </div>
              )}
            />
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