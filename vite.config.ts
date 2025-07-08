import { defineConfig, type UserConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { resolve } from 'path';
import pkg from "./package.json";
import babel from 'vite-plugin-babel';

type PkgDep = Record<string, string>;
const { dependencies = {}, devDependencies = {} } = pkg as any as {
  dependencies: PkgDep;
  devDependencies: PkgDep;
  [key: string]: unknown;
};

errorOnDuplicatesPkgDeps(devDependencies, dependencies);

export default defineConfig(({ command, mode }): UserConfig => {
  return {
    plugins: [qwikCity(), qwikVite(), tsconfigPaths()],
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
  };
});

// 중복 의존성 검사 함수
function errorOnDuplicatesPkgDeps(devDependencies: PkgDep, dependencies: PkgDep) {
  const duplicateDeps = Object.keys(devDependencies).filter(dep => dependencies[dep]);
  const qwikPkg = Object.keys(dependencies).filter(value => /qwik/i.test(value));

  if (qwikPkg.length > 0) {
    throw new Error(`Move qwik packages ${qwikPkg.join(", ")} to devDependencies`);
  }

  if (duplicateDeps.length > 0) {
    throw new Error(`
      Warning: The dependency "${duplicateDeps.join(", ")}" is listed in both devDependencies and dependencies.
      Please move it to devDependencies only.
    `);
  }
}
