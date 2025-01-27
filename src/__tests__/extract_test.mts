import { extract } from '../index.mjs';
import { describe, it, beforeEach, afterEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import { rimrafSync } from 'rimraf';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const touchSync = (file: string) => fs.closeSync(fs.openSync(file, 'w'));
const zf = (n: number, len = 2) => String(n).padStart(len, '0');
const ymd = (d = new Date()) => `${d.getFullYear()}${zf(d.getMonth() + 1)}${zf(d.getDate())}${zf(d.getHours())}${zf(d.getMinutes())}${zf(d.getSeconds())}${zf(d.getMilliseconds(), 3)}`;
const shouldNotBeRejected = (args: any) => {
  console.error(args);
  assert(false, 'should not be rejected');
};
const shouldNotBeResolved = (args: any) => {
  console.error(args);
  assert(false, 'should not be resolved');
};

describe('`extract({ treeIsh, dest, [gitProjectRoot], [spawnOptions] })`: Extracts contents of `treeIsh` into `dest` directory', () => {
  let targetDir: string;
  beforeEach(() => {
    targetDir = join(tmpdir(), ymd());
  });
  afterEach(() => {
    if (fs.existsSync(targetDir)) {
      rimrafSync(targetDir);
    }
  });

  describe('returns `Promise` which will:', () => {
    it('resolve with object containing `{treeIsh, dir}` when succeeded', () => {
      return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
        assert.deepStrictEqual(result, {
          treeIsh: 'initial',
          dir: targetDir
        });
      });
    });

    it('extract tree-ish content into `dest` on resolve', () => {
      assert(!fs.existsSync(targetDir));
      return extract({ treeIsh: 'initial', dest: targetDir }).then((_result) => {
        assert(fs.existsSync(join(targetDir, '.gitignore')));
        assert(fs.existsSync(join(targetDir, 'package.json')));
        assert(!fs.existsSync(join(targetDir, 'index.js')));
      });
    });
  });

  describe('`treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be extracted into `dest`', () => {
    describe('when tree-ish specified by `treeIsh` does not exist:', () => {
      it('reject with Error', () => {
        return extract({ treeIsh: 'nonexistent', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === 'Specified <tree-ish> does not exist [nonexistent]');
        });
      });
    });
  });

  describe('`dest`(string) is a directory path which `extract` going to extract tree-ish content', () => {
    describe('when directory specified by `dest` does not exist:', () => {
      it('creates `dest` recursively then resolves as usual', () => {
        assert(!fs.existsSync(targetDir));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((_result) => {
          assert(fs.existsSync(targetDir));
        });
      });
    });

    describe('when directory specified by `dest` already exists:', () => {
      it('resolves as usual when `dest` directory is empty', () => {
        fs.mkdirSync(targetDir);
        assert(!fs.existsSync(join(targetDir, '.gitignore')));
        assert(!fs.existsSync(join(targetDir, 'package.json')));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((_result) => {
          assert(fs.existsSync(join(targetDir, '.gitignore')));
          assert(fs.existsSync(join(targetDir, 'package.json')));
        });
      });

      it('rejects with Error when `dest` directory is not empty', () => {
        fs.mkdirSync(targetDir);
        touchSync(join(targetDir, 'foo'));
        return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === `Specified <dest> is not empty [${targetDir}]`);
        });
      });

      it('rejects with Error when `dest` directory is not writable or `dest` is not a directory', () => {
        touchSync(targetDir);
        return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.code === 'ENOTDIR');
        });
      });
    });
  });

  describe('`gitProjectRoot`(string) is an optional directory path pointing to top level directory of git project', () => {
    describe('when `gitProjectRoot` option is omitted:', () => {
      let orig: string;
      beforeEach(() => {
        orig = process.cwd();
      });
      afterEach(() => {
        process.chdir(orig);
      });
      describe('when `process.cwd()` is inside the git project:', () => {
        it('resolves as usual', () => {
          process.chdir(__dirname);
          return extract({ treeIsh: 'initial', dest: targetDir }).then((_result) => {
            assert(fs.existsSync(join(targetDir, '.gitignore')));
            assert(fs.existsSync(join(targetDir, 'package.json')));
            assert(!fs.existsSync(join(targetDir, 'index.js')));
          }, shouldNotBeRejected);
        });
      });
      describe('when `process.cwd()` is outside the git project:', () => {
        it('returns `Promise` which will reject with Error', () => {
          process.chdir(tmpdir());
          return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
            assert(err);
            assert(err.message === 'Git project root does not found');
          });
        });
      });
    });
    describe('when specified `gitProjectRoot` is pointing to git project root and `treeIsh` exists too:', () => {
      it('resolves as usual when `dest` is empty', () => {
        const gitProjectRoot = join(__dirname, '..', '..');
        return extract({ treeIsh: 'initial', dest: targetDir, gitProjectRoot }).then((_result) => {
          assert(fs.existsSync(join(targetDir, '.gitignore')));
          assert(fs.existsSync(join(targetDir, 'package.json')));
          assert(!fs.existsSync(join(targetDir, 'index.js')));
        }, shouldNotBeRejected);
      });
    });
    describe('when specified `gitProjectRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitProjectRoot: tmpdir() }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === 'Specified <tree-ish> does not exist [initial]');
        });
      });
    });
    describe('when specified `gitProjectRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitProjectRoot: join(tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
  });
});
