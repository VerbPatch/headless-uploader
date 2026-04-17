import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };

export default {
  input: 'src/index.tsx',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
    },
  ],
  external: ['react', '@verbpatch/headless-uploader'],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: { browsers: '> 0.25%, not dead' } }],
        '@babel/preset-react',
        '@babel/preset-typescript',
      ],
    }),
    terser(),
  ],
};
