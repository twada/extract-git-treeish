### [4.0.2](http://github.com/twada/extract-git-treeish/releases/tag/v4.0.2) (2025-01-29)


#### Bug Fixes

* add "import" to conditional exports field for fallback ([40d801a8](http://github.com/twada/extract-git-treeish/commit/40d801a82a973a4d982df20da4c8aaa56da73469))


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
