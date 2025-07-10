import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';
import pkg from "./package.json";

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};

errorOnDuplicatesPkgDeps(devDependencies, dependencies);

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [
      qwikCity(),
      qwikVite(),
      tsconfigPaths()
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    server: {
      headers: {
        "Cache-Control": "public, max-age=0",
      },
    },
    preview: {
      headers: {
        "Cache-Control": "public, max-age=600",
        "Transfer-Encoding": "chunked",
      },
    },
    esbuild: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true,
          useDefineForClassFields: false,
        },
      },
    },
    ssr: {
      noExternal: ['@builder.io/qwik', '@builder.io/qwik-city']
    },
    build: {
      rollupOptions: {
        external: [
          // 브라우저 전용 API들을 외부 의존성으로 처리
          'HTMLElement',
          'window',
          'document'
        ]
      }
    },
    define: {
      // 서버 환경에서 브라우저 전용 객체들에 대한 폴백 정의
      global: 'globalThis',
    }
  };
});

// 중복 의존성 검사 함수
function errorOnDuplicatesPkgDeps(devDependencies: PkgDep, dependencies: PkgDep) {
  const duplicateDeps = Object.keys(devDependencies).filter(dep => dependencies[dep]);
  const qwikPkg = Object.keys(dependencies).filter(value => /qwik/i.test(value));

  if (qwikPkg.length > 2) {
    throw new Error(`Move qwik packages ${qwikPkg.join(", ")} to devDependencies`);
  }

  if (duplicateDeps.length > 0) {
    throw new Error(`
      Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both devDependencies and dependencies.
      Please move it to devDependencies only.
    `);
  }
}