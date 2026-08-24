### [4.0.2](http://github.com/twada/extract-git-treeish/releases/tag/v4.0.2) (2025-01-29)


#### Bug Fixes

* add "import" to conditional exports field for fallback ([40d801a8](http://github.com/twada/extract-git-treeish/commit/40d801a82a973a4d982df20da4c8aaa56da73469))


## [5.0.0](https://github.com/twada/extract-git-treeish/compare/extract-git-treeish-v4.0.2...extract-git-treeish-v5.0.0) (2026-08-24)


### ⚠ BREAKING CHANGES

* 

### Features

* `exists` function examines existence of git tree-ish object ([89ffa46](https://github.com/twada/extract-git-treeish/commit/89ffa46702640b5c25d1459cd29e4f45aefaef60))
* `extract` function extracts files from git tree-ish ([32553e2](https://github.com/twada/extract-git-treeish/commit/32553e20263cfff3155d5d09a8ebca851b2d3ad3))
* `extractEach` extracts each tree-ish content specified by `treeIshNames` ([6513349](https://github.com/twada/extract-git-treeish/commit/6513349d2dbc1476766bfc832200b492d28ea6a4))
* `resolveGitRoot` resolves absolute path of the git top-level directory ([1b031b8](https://github.com/twada/extract-git-treeish/commit/1b031b85334aa65e8183dcefb30349cfe6aaaf76))
* **exists:** throw TypeError when `gitRoot` is not a string ([4386a76](https://github.com/twada/extract-git-treeish/commit/4386a768cc46baf9cd33485b1d5814f1eda08f12))
* **exists:** throw TypeError when `treeIsh` is not a string ([bcffb01](https://github.com/twada/extract-git-treeish/commit/bcffb01b61498d49e5369afe4ea326649c4a0277))
* **extract:** simplify spec, creates destinationDir if does not exist ([26573a8](https://github.com/twada/extract-git-treeish/commit/26573a88d7deb1f00d620ebf6d115cfade019585))
* find git project root when `gitRoot` option is omitted ([4be4393](https://github.com/twada/extract-git-treeish/commit/4be43939344f05db9f1ac2cd4bdc2e99aebbe9d1))
* migrate codebase to ESM ([75a5e4b](https://github.com/twada/extract-git-treeish/commit/75a5e4b03e1c6181fa067d63494e73705ca7cda2))
* prefer small orthogonal set of primitives ([02b78ae](https://github.com/twada/extract-git-treeish/commit/02b78ae938df733d4b81c893fa78b49fcb2a9bcd))
* provide type declaration file ([182122f](https://github.com/twada/extract-git-treeish/commit/182122f45b4ac9e2044212cd6ce38b64fabfaeef))
* rejects when `dest` is not empty ([2defb3c](https://github.com/twada/extract-git-treeish/commit/2defb3cf21ef2493be140c8565aa280eaff42b35))
* rewrite to typescript ([bca738b](https://github.com/twada/extract-git-treeish/commit/bca738b48d63fa271cca58f0b7349028130837d8))
* throw TypeError when `gitRoot` is not a string ([4fb88fd](https://github.com/twada/extract-git-treeish/commit/4fb88fdb0e96f5de02e8cdaf35a7a0dfbbb39024))
* throw TypeError when `treeIsh` or `dest` is not a string ([41c66a4](https://github.com/twada/extract-git-treeish/commit/41c66a4910b08863d593407eea81bbd073b2a034))
* **tsconfig:** set module and moduleResolution to "node16" ([9039960](https://github.com/twada/extract-git-treeish/commit/903996061d9af0f0ee7a4d326a3797eccbf5cf8e))
* use `exports` for ESM and CJS, `main` for legacy Node ([28ca397](https://github.com/twada/extract-git-treeish/commit/28ca3975a2a5c57c05c4e830b7b09e2df322358f))


### Bug Fixes

* add "import" to conditional exports field for fallback ([40d801a](https://github.com/twada/extract-git-treeish/commit/40d801a82a973a4d982df20da4c8aaa56da73469))
* add types field for fallback ([a4497c2](https://github.com/twada/extract-git-treeish/commit/a4497c292c684078c945c8635502e59bc0a1c317))
* **extract:** rejects when destinationDir is not accessible ([f08aff8](https://github.com/twada/extract-git-treeish/commit/f08aff8d365bcd714c6facf9980d56c6e2e2d9bc))
* only handle undefined to detect omitted optional parameter ([88381c1](https://github.com/twada/extract-git-treeish/commit/88381c151548784f611891bf39f47c4702f9ac67))
* update node-tar to avoid vulnerable versions ([6ac6809](https://github.com/twada/extract-git-treeish/commit/6ac6809fa17a9b14f0b5dca187ccac803bd8d0da))


### Miscellaneous Chores

* set node minimum version to 22.12.0, the version where require(esm) is now enabled by default ([2b73f45](https://github.com/twada/extract-git-treeish/commit/2b73f450a0ba9359c0662b40a291678606536715))

### [4.0.1](http://github.com/twada/extract-git-treeish/releases/tag/v4.0.1) (2025-01-29)


#### Bug Fixes

* add types field to package.json for fallback ([a4497c29](http://github.com/twada/extract-git-treeish/commit/a4497c292c684078c945c8635502e59bc0a1c317))


## [4.0.0](http://github.com/twada/extract-git-treeish/releases/tag/v4.0.0) (2025-01-28)


#### Features

* [Migrate to pure ESM module in favor of `require(esm)`](https://github.com/twada/extract-git-treeish/pull/12)


#### Breaking Changes

* set Node minimum version to [v22.12.0](https://nodejs.org/ja/blog/release/v22.12.0), the version where `require(esm)` is enabled by default.


## [3.1.0](http://github.com/twada/extract-git-treeish/releases/tag/v3.1.0) (2023-12-18)


#### Features

* **tsconfig:** set `compilerOptions.module` and `compilerOptions.moduleResolution` to `"node16"` ([90399606](http://github.com/twada/extract-git-treeish/commit/903996061d9af0f0ee7a4d326a3797eccbf5cf8e))


## [3.0.0](http://github.com/twada/extract-git-treeish/releases/tag/v3.0.0) (2023-03-18)


#### Features

* [Move codebase to TypeScript](https://github.com/twada/extract-git-treeish/pull/10)
  * Rewrite to TypeScript ([bca738b4](http://github.com/twada/extract-git-treeish/commit/bca738b48d63fa271cca58f0b7349028130837d8))
  * Provide Type Declaration file ([182122f4](http://github.com/twada/extract-git-treeish/commit/182122f45b4ac9e2044212cd6ce38b64fabfaeef))
  * Provide ESM/CJS dual package configuration with types ([ab660dc5](https://github.com/twada/extract-git-treeish/pull/10/commits/ab660dc5321b235f4ec0371bbbd4a7b2ba0ec834))


## [2.0.0](http://github.com/twada/extract-git-treeish/releases/tag/v2.0.0) (2022-07-23)


#### Features

* [Provide dual CJS/ESM package](https://github.com/twada/extract-git-treeish/pull/7)
  * use `exports` for ESM and CJS, `main` for legacy Node ([28ca3975](http://github.com/twada/extract-git-treeish/commit/28ca3975a2a5c57c05c4e830b7b09e2df322358f))
  * migrate codebase to ESM ([75a5e4b0](http://github.com/twada/extract-git-treeish/commit/75a5e4b03e1c6181fa067d63494e73705ca7cda2))


## [1.0.0](http://github.com/twada/extract-git-treeish/releases/tag/v1.0.0) (2020-07-23)


#### Features

* first stable release


## [0.1.0](http://github.com/twada/extract-git-treeish/releases/tag/v0.1.0) (2020-07-20)


#### Features

* initial release
