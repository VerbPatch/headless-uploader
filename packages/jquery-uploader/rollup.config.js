import { defineConfig } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import pkg from './package.json' with { type: 'json' };
import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

const banner = `/**
 * Headless Uploader jQuery v${pkg.version}
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

export default defineConfig([
  {
    input: 'src/index.ts',
    output: {
      file: pkg.main,
      format: 'umd',
      name: 'HeadlessUploaderJQuery',
      globals: {
        jquery: 'jQuery',
      },
      banner,
      exports: 'named',
      inlineDynamicImports: true,
    },
    external: ['jquery'],
    plugins: [
      replace({
        preventAssignment: true,
        values: {
          "from 'tus-js-client'": "from 'tus-js-client/lib.esm/browser/index.js'",
          'from "tus-js-client"': 'from "tus-js-client/lib.esm/browser/index.js"',
          "import('tus-js-client')": "import('tus-js-client/lib.esm/browser/index.js')",
          'import("tus-js-client")': 'import("tus-js-client/lib.esm/browser/index.js")',
          // also replace the deep import used in headless-uploader
          "import('tus-js-client/lib.esm/browser/index.js' as any)":
            "import('tus-js-client/lib.esm/browser/index.js')",
        },
      }),
      nodeResolve({ browser: true }),
      commonjs(),
      typescript({ tsconfig: './tsconfig.json' }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.module,
        format: 'es',
        banner,
        exports: 'named',
      },
      {
        file: 'dist/index.js',
        format: 'cjs',
        banner,
        exports: 'named',
      },
    ],
    external: ['jquery', '@verbpatch/headless-uploader'],
    plugins: [nodeResolve(), commonjs(), typescript({ tsconfig: './tsconfig.json' }), terser()],
  },
]);
