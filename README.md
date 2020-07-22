extract-git-treeish
================================

Extracts git tree-ish (commits, branches, or tags) into target directory.

[![Build Status][travis-image]][travis-url]
[![NPM version][npm-image]][npm-url]
[![Code Style][style-image]][style-url]
[![License][license-image]][license-url]


USAGE
---------------------------------------

`exists({ treeIsh, [gitProjectRoot], [spawnOptions] })`: Inquires for existence of `treeIsh`

```js
const { exists } = require('extract-git-treeish');
const assert = require('assert');
assert(await exists({ treeIsh: 'master' }) === true);
assert(await exists({ treeIsh: 'doesnotexist' }) === false);
```

`extract({ treeIsh, dest, [gitProjectRoot], [spawnOptions] })`: Extracts contents of `treeIsh` into `dest` directory

```js
const { extract } = require('extract-git-treeish');
const assert = require('assert');
const path = require('path');
const destDir = path.join(process.cwd(), 'demo', 'v1');
const extracted = await extract({ treeIsh: 'v1.0.0', dest: destDir })
assert.deepStrictEqual(extracted, {
  treeIsh: 'v1.0.0',
  dir: '/path/to/cwd/demo/v1'
});
```


API
---------------------------------------

### `exists({ treeIsh, [gitProjectRoot], [spawnOptions] })`: Inquires for existence of `treeIsh`
  - returns `Promise` which will:
    - resolve with `true` when tree-ish exists
    - resolve with `false` when tree-ish does not exist
  - `treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be inquired
    - when `treeIsh` argument is omitted:
      - throw TypeError
    - when `treeIsh` argument is not a string:
      - throw TypeError
  - `gitProjectRoot`(string) is an optional directory path pointing to top level directory of git project
    - when `gitProjectRoot` option is omitted:
      - and when `process.cwd()` is inside the git project:
        - resolves as usual
      - and when `process.cwd()` is outside the git project:
        - returns `Promise` which will reject with Error
    - when specified `gitProjectRoot` is pointing to git project root:
      - resolves as usual
    - when specified `gitProjectRoot` is not a git repository (or any of the parent directories):
      - returns `Promise` which will resolve with `false`
    - when specified `gitProjectRoot` is pointing to directory that does not exist:
      - returns `Promise` which will reject with Error
    - when `gitProjectRoot` argument is not a string:
      - throw TypeError when number
      - throw TypeError when boolean

### `extract({ treeIsh, dest, [gitProjectRoot], [spawnOptions] })`: Extracts contents of `treeIsh` into `dest` directory
  - returns `Promise` which will:
    - resolve with object containing `{treeIsh, dir}` when succeeded
    - extract tree-ish content into `dest` on resolve
  - `treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be extracted into `dest`
    - when tree-ish specified by `treeIsh` does not exist:
      - reject with Error
    - when `treeIsh` argument is omitted:
      - throw TypeError
    - when `treeIsh` argument is not a string:
      - throw TypeError
  - `dest`(string) is a directory path which `extract` going to extract tree-ish content
    - when directory specified by `dest` does not exist:
      - creates `dest` recursively then resolves as usual
    - when directory specified by `dest` already exists:
      - resolves as usual when `dest` directory is empty
      - rejects with Error when `dest` directory is not empty
      - rejects with Error when `dest` directory is not writable or `dest` is not a directory
    - when `dest` argument is omitted:
      - throw TypeError
    - when `dest` argument is not a string:
      - throw TypeError
  - `gitProjectRoot`(string) is an optional directory path pointing to top level directory of git project
    - when `gitProjectRoot` option is omitted:
      - when `process.cwd()` is inside the git project:
        - resolves as usual
      - when `process.cwd()` is outside the git project:
        - returns `Promise` which will reject with Error
    - when specified `gitProjectRoot` is pointing to git project root and `treeIsh` exists too:
      - resolves as usual when `dest` is empty
    - when specified `gitProjectRoot` is not a git repository (or any of the parent directories):
      - returns `Promise` which will reject with Error
    - when specified `gitProjectRoot` is pointing to directory that does not exist:
      - returns `Promise` which will reject with Error
    - when `gitProjectRoot` argument is not a string:
      - throw TypeError when number
      - throw TypeError when boolean


INSTALL
---------------------------------------

```sh
$ npm install extract-git-treeish
```


AUTHOR
---------------------------------------
* [Takuto Wada](https://github.com/twada)


LICENSE
---------------------------------------
Licensed under the [MIT](https://twada.mit-license.org) license.

[travis-url]: https://travis-ci.org/twada/extract-git-treeish
[travis-image]: https://secure.travis-ci.org/twada/extract-git-treeish.svg?branch=master

[npm-url]: https://npmjs.org/package/extract-git-treeish
[npm-image]: https://badge.fury.io/js/extract-git-treeish.svg

[style-url]: https://github.com/standard/semistandard
[style-image]: https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg

[license-url]: https://twada.mit-license.org
[license-image]: https://img.shields.io/badge/license-MIT-brightgreen.svg
