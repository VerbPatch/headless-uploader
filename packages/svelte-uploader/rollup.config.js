import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.cjs.js',
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: [
    'svelte',
    'svelte/store',
    '@verbpatch/headless-uploader',
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
      dedupe: ['svelte', 'svelte/store'],
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      sourceMap: true,
      declarationDir: './dist',
      rootDir: 'src',
    }),
    terser(),
  ],
};
