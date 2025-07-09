/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is rendered outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import {
  renderToStream,
  type RenderToStreamOptions,
} from "@builder.io/qwik/server";
import Root from "./root";

// 서버 환경에서 브라우저 전용 API들에 대한 포괄적인 폴리필
if (typeof globalThis !== 'undefined') {
  if (typeof HTMLElement === 'undefined') {
    (globalThis as any).HTMLElement = class HTMLElement {} as any;
  }

  if (typeof document === 'undefined') {
    (globalThis as any).document = {
      createElement: () => ({
        setAttribute: () => {},
        removeAttribute: () => {},
        appendChild: () => {},
        removeChild: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        style: {},
        classList: {
          add: () => {},
          remove: () => {},
          contains: () => false,
          toggle: () => {}
        }
      }),
      createTreeWalker: () => ({
        nextNode: () => null,
        previousNode: () => null,
        currentNode: null,
        root: null,
        filter: null,
        whatToShow: 0
      }),
      createNodeIterator: () => ({
        nextNode: () => null,
        previousNode: () => null,
        root: null,
        filter: null,
        whatToShow: 0
      }),
      addEventListener: () => {},
      removeEventListener: () => {},
      querySelector: () => null,
      querySelectorAll: () => [],
      getElementById: () => null,
      getElementsByClassName: () => [],
      getElementsByTagName: () => [],
      head: {
        appendChild: () => {},
        removeChild: () => {},
        insertBefore: () => {}
      },
      body: {
        appendChild: () => {},
        removeChild: () => {},
        insertBefore: () => {}
      },
      documentElement: {
        appendChild: () => {},
        removeChild: () => {},
        insertBefore: () => {}
      }
    } as any;
  }

  if (typeof window === 'undefined') {
    (globalThis as any).window = {
      addEventListener: () => {},
      removeEventListener: () => {},
      document: (globalThis as any).document,
      location: {
        href: '',
        origin: '',
        pathname: '',
        search: '',
        hash: ''
      },
      navigator: {
        userAgent: 'Node.js'
      },
      history: {
        pushState: () => {},
        replaceState: () => {},
        back: () => {},
        forward: () => {},
        go: () => {}
      },
      localStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      },
      sessionStorage: {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
        clear: () => {}
      },
      setTimeout: globalThis.setTimeout,
      clearTimeout: globalThis.clearTimeout,
      setInterval: globalThis.setInterval,
      clearInterval: globalThis.clearInterval,
      customElements: {
        define: () => {},
        get: () => undefined,
        whenDefined: () => Promise.resolve(),
        upgrade: () => {}
      }
    } as any;
  }

  // customElements 글로벌 정의
  if (typeof customElements === 'undefined') {
    (globalThis as any).customElements = {
      define: () => {},
      get: () => undefined,
      whenDefined: () => Promise.resolve(),
      upgrade: () => {}
    } as any;
  }

  // Node 타입들도 정의
  if (typeof Node === 'undefined') {
    (globalThis as any).Node = {
      ELEMENT_NODE: 1,
      ATTRIBUTE_NODE: 2,
      TEXT_NODE: 3,
      CDATA_SECTION_NODE: 4,
      ENTITY_REFERENCE_NODE: 5,
      ENTITY_NODE: 6,
      PROCESSING_INSTRUCTION_NODE: 7,
      COMMENT_NODE: 8,
      DOCUMENT_NODE: 9,
      DOCUMENT_TYPE_NODE: 10,
      DOCUMENT_FRAGMENT_NODE: 11,
      NOTATION_NODE: 12
    } as any;
  }

  // NodeFilter 상수들
  if (typeof NodeFilter === 'undefined') {
    (globalThis as any).NodeFilter = {
      SHOW_ALL: 0xFFFFFFFF,
      SHOW_ELEMENT: 0x00000001,
      SHOW_ATTRIBUTE: 0x00000002,
      SHOW_TEXT: 0x00000004,
      SHOW_CDATA_SECTION: 0x00000008,
      SHOW_ENTITY_REFERENCE: 0x00000010,
      SHOW_ENTITY: 0x00000020,
      SHOW_PROCESSING_INSTRUCTION: 0x00000040,
      SHOW_COMMENT: 0x00000080,
      SHOW_DOCUMENT: 0x00000100,
      SHOW_DOCUMENT_TYPE: 0x00000200,
      SHOW_DOCUMENT_FRAGMENT: 0x00000400,
      SHOW_NOTATION: 0x00000800,
      FILTER_ACCEPT: 1,
      FILTER_REJECT: 2,
      FILTER_SKIP: 3
    } as any;
  }

  // CustomElementRegistry 클래스 정의
  if (typeof CustomElementRegistry === 'undefined') {
    (globalThis as any).CustomElementRegistry = class CustomElementRegistry {
      define() {}
      get() { return undefined; }
      whenDefined() { return Promise.resolve(); }
      upgrade() {}
    } as any;
  }
}

export default function (opts: RenderToStreamOptions) {
  return renderToStream(<Root />, {
    ...opts,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      lang: "en-us",
      ...opts.containerAttributes,
    },
    serverData: {
      ...opts.serverData,
    },
  });
}