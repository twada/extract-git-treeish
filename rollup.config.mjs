import {promises as fs} from 'fs';
import externals from 'rollup-plugin-node-externals';
import copy from 'rollup-plugin-copy';

const distDir = await fs.readdir(new URL('./dist', import.meta.url));

export default {
  input: distDir.filter((file) => file.endsWith('.mjs')).map((x) => `dist/${x}`),
  output: {
    dir: 'dist',
    format: 'cjs',
    entryFileNames: '[name].js',
    // entryFileNames: '[name].cjs',
    // create a module for each module in the input, instead of trying to chunk them together.
    preserveModules: true,
    // do not add `Object.defineProperty(exports, '__esModule', { value: true })`
    esModule: false,
    // use const instead of var when creating statements
    generatedCode : {
      constBindings: true
    }
  },
  plugins: [
    // https://github.com/Septh/rollup-plugin-node-externals
    externals({
      // strip 'node:' prefix
      builtinsPrefix: 'strip'
    }),
    // https://github.com/vladshcherbin/rollup-plugin-copy
    copy({
      targets: [
        // copy from index.d.mts to index.d.ts while removing the "node:" protocol
        {
          src: 'dist/*.d.mts',
          dest: 'dist/',
          rename: (name, extension, fullPath) => {
            // name => 'index.d', extension => 'mts' here
            return `${name}.ts`;
          },
          transform: (contents, filename) => contents.toString().replace('node:', '')
        }
      ]
    })
  ]
};
