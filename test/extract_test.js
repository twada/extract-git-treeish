'use strict';

delete require.cache[require.resolve('..')];
const { extract } = require('..');
const assert = require('assert').strict;
const os = require('os');
const fs = require('fs');
const path = require('path');
const findRoot = require('find-root');
const rimraf = require('rimraf');
const touchSync = (file) => fs.closeSync(fs.openSync(file, 'w'));
const zf = (n, len = 2) => String(n).padStart(len, '0');
const ymd = (d = new Date()) => `${d.getFullYear()}${zf(d.getMonth() + 1)}${zf(d.getDate())}${zf(d.getHours())}${zf(d.getMinutes())}${zf(d.getSeconds())}${zf(d.getMilliseconds(), 3)}`;
const shouldNotBeRejected = (args) => {
  console.error(args);
  assert(false, 'should not be rejected');
};
const shouldNotBeResolved = (args) => {
  console.error(args);
  assert(false, 'should not be resolved');
};

describe('extract({ treeIsh, dest, [gitRoot], [spawnOptions] }): Extracts contents of `treeIsh` into `dest` directory', () => {
  let targetDir;
  beforeEach(() => {
    targetDir = path.join(os.tmpdir(), ymd());
  });
  afterEach(() => {
    if (fs.existsSync(targetDir)) {
      rimraf.sync(targetDir);
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
      return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
        assert(fs.existsSync(path.join(targetDir, '.gitignore')));
        assert(fs.existsSync(path.join(targetDir, 'package.json')));
        assert(!fs.existsSync(path.join(targetDir, 'index.js')));
      });
    });
  });

  describe('`treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be extracted into `dest`', () => {
    it('reject with Error when tree-ish specified by `treeIsh` does not exist', () => {
      return extract({ treeIsh: 'nonexistent', dest: targetDir }).then(shouldNotBeResolved, (err) => {
        assert(err);
        assert(err.message === 'Specified <tree-ish> does not exist [nonexistent]');
      });
    });
  });

  describe('`dest`(string) is a directory path which `extract` going to extract tree-ish content', () => {
    context('when `dest` does not exist:', () => {
      it('creates `dest` recursively then resolves as usual', () => {
        assert(!fs.existsSync(targetDir));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
          assert(fs.existsSync(targetDir));
        });
      });
    });

    context('when `dest` already exists:', () => {
      it('resolves as usual when `dest` is empty', () => {
        fs.mkdirSync(targetDir);
        assert(!fs.existsSync(path.join(targetDir, '.gitignore')));
        assert(!fs.existsSync(path.join(targetDir, 'package.json')));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
          assert(fs.existsSync(path.join(targetDir, '.gitignore')));
          assert(fs.existsSync(path.join(targetDir, 'package.json')));
        });
      });

      it('rejects with Error when `dest` is not empty', () => {
        fs.mkdirSync(targetDir);
        touchSync(path.join(targetDir, 'foo'));
        return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === `Specified <dest> is not empty [${targetDir}]`);
        });
      });

      it('rejects with Error when `dest` is not writable or not a directory', () => {
        touchSync(targetDir);
        return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.code === 'ENOTDIR');
        });
      });
    });
  });

  describe('`gitRoot`(string) is an optional directory path pointing to top level directory of git project', () => {
    context('when `gitRoot` exists and `treeIsh` exists too:', () => {
      it('resolves as usual when `dest` is empty', () => {
        const gitRoot = findRoot(process.cwd(), (dir) => fs.existsSync(path.join(dir, '.git')));
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot }).then((result) => {
          assert(fs.existsSync(path.join(targetDir, '.gitignore')));
          assert(fs.existsSync(path.join(targetDir, 'package.json')));
          assert(!fs.existsSync(path.join(targetDir, 'index.js')));
        }, shouldNotBeRejected);
      });
    });
    context('when `gitRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot: os.tmpdir() }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === 'Specified <tree-ish> does not exist [initial]');
        });
      });
    });
    context('when `gitRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot: path.join(os.tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
  });
});
