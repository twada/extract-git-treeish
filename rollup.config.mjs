import {promises as fs} from 'fs';

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
  }
};
