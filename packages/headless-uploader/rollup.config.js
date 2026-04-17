import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };

const mybanner = `/**
 * Headless Uploader v${pkg.version}
 * Copyright (c) 2025 VerbPatch
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 *
 * @license GPL-3.0-or-later
 */`;

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true,
      exports: 'named',
      banner: mybanner,
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true,
      exports: 'named',
      banner: mybanner,
    },
    {
      file: pkg.browser,
      format: 'umd',
      name: 'HeadlessUploader',
      sourcemap: true,
      exports: 'named',
      banner: mybanner,
      globals: {
        'tus-js-client': 'tus',
      },
    },
  ],
  external: ['tus-js-client'],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    typescript({
      tsconfig: './tsconfig.json',
      declaration: true,
      declarationDir: './dist',
      rootDir: './src',
    }),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        ['@babel/preset-env', { targets: { browsers: '> 0.25%, not dead' } }],
        '@babel/preset-typescript',
      ],
    }),
    terser(),
    // terser({
    //   mangle: {
    //     toplevel: false, // prevent renaming top-level identifiers
    //     properties: false, // prevent renaming object properties
    //   },
    //   compress: false, // Do not compress expressions
    //   format: {
    //     beautify: true, // Output readable code
    //     comments: true, // Keep comments
    //   },
    //   toplevel: false,
    //   keep_classnames: true, // Preserve class names
    //   keep_fnames: true, // Preserve function names
    // }),
  ],
};
