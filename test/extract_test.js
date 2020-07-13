'use strict';

delete require.cache[require.resolve('..')];
const { extract } = require('..');
const assert = require('assert').strict;
const os = require('os');
const fs = require('fs');
const path = require('path');
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
    context('when tree-ish specified by `treeIsh` does not exist:', () => {
      it('reject with Error', () => {
        return extract({ treeIsh: 'nonexistent', dest: targetDir }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === 'Specified <tree-ish> does not exist [nonexistent]');
        });
      });
    });
    context('when `treeIsh` argument is omitted:', () => {
      it('throw TypeError', () => {
        assert.throws(() => {
          extract({ dest: targetDir });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "treeIsh" argument must be of type string. Received type undefined');
          return true;
        });
      });
    });
    context('when `treeIsh` argument is not a string:', () => {
      it('throw TypeError', () => {
        assert.throws(() => {
          extract({ treeIsh: 1234, dest: targetDir });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "treeIsh" argument must be of type string. Received type number');
          return true;
        });
      });
    });
  });

  describe('`dest`(string) is a directory path which `extract` going to extract tree-ish content', () => {
    context('when directory specified by `dest` does not exist:', () => {
      it('creates `dest` recursively then resolves as usual', () => {
        assert(!fs.existsSync(targetDir));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
          assert(fs.existsSync(targetDir));
        });
      });
    });

    context('when directory specified by `dest` already exists:', () => {
      it('resolves as usual when `dest` directory is empty', () => {
        fs.mkdirSync(targetDir);
        assert(!fs.existsSync(path.join(targetDir, '.gitignore')));
        assert(!fs.existsSync(path.join(targetDir, 'package.json')));
        return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
          assert(fs.existsSync(path.join(targetDir, '.gitignore')));
          assert(fs.existsSync(path.join(targetDir, 'package.json')));
        });
      });

      it('rejects with Error when `dest` directory is not empty', () => {
        fs.mkdirSync(targetDir);
        touchSync(path.join(targetDir, 'foo'));
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

    context('when `dest` argument is omitted:', () => {
      it('throw TypeError', () => {
        assert.throws(() => {
          extract({ treeIsh: 'initial' });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "dest" argument must be of type string. Received type undefined');
          return true;
        });
      });
    });

    context('when `dest` argument is not a string:', () => {
      it('throw TypeError', () => {
        assert.throws(() => {
          extract({ treeIsh: 'initial', dest: null });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "dest" argument must be of type string. Received null');
          return true;
        });
      });
    });
  });

  describe('`gitRoot`(string) is an optional directory path pointing to top level directory of git project', () => {
    context('when `gitRoot` option is omitted:', () => {
      let orig;
      beforeEach(() => {
        orig = process.cwd();
      });
      afterEach(() => {
        process.chdir(orig);
      });
      context('when `process.cwd()` is inside the git project:', () => {
        it('resolves as usual', () => {
          process.chdir(__dirname);
          return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
            assert(fs.existsSync(path.join(targetDir, '.gitignore')));
            assert(fs.existsSync(path.join(targetDir, 'package.json')));
            assert(!fs.existsSync(path.join(targetDir, 'index.js')));
          }, shouldNotBeRejected);
        });
      });
      context('when `process.cwd()` is outside the git project:', () => {
        it('returns `Promise` which will reject with Error', () => {
          process.chdir(os.tmpdir());
          return extract({ treeIsh: 'initial', dest: targetDir }).then(shouldNotBeResolved, (err) => {
            assert(err);
            assert(err.message === 'Git project root does not found');
          });
        });
      });
    });
    context('when specified `gitRoot` is pointing to git project root and `treeIsh` exists too:', () => {
      it('resolves as usual when `dest` is empty', () => {
        const gitRoot = path.join(__dirname, '..');
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot }).then((result) => {
          assert(fs.existsSync(path.join(targetDir, '.gitignore')));
          assert(fs.existsSync(path.join(targetDir, 'package.json')));
          assert(!fs.existsSync(path.join(targetDir, 'index.js')));
        }, shouldNotBeRejected);
      });
    });
    context('when specified `gitRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot: os.tmpdir() }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err.message === 'Specified <tree-ish> does not exist [initial]');
        });
      });
    });
    context('when specified `gitRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return extract({ treeIsh: 'initial', dest: targetDir, gitRoot: path.join(os.tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
    context('when `gitRoot` argument is not a string:', () => {
      it('throw TypeError when number', () => {
        assert.throws(() => {
          extract({ treeIsh: 'initial', dest: targetDir, gitRoot: 1234 });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "gitRoot" argument must be of type string. Received type number');
          return true;
        });
      });
      it('throw TypeError when boolean', () => {
        assert.throws(() => {
          extract({ treeIsh: 'initial', dest: targetDir, gitRoot: false });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "gitRoot" argument must be of type string. Received type boolean');
          return true;
        });
      });
    });
  });
});
