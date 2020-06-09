'use strict';

delete require.cache[require.resolve('..')];
const { exists } = require('..');
const assert = require('assert').strict;
const os = require('os');
const path = require('path');
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

describe('exists({ treeIsh, [gitRoot], [spawnOptions] }): Inquires for existence of `treeIsh`', () => {
  describe('`treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be inquired', () => {
    context('when tree-ish exists:', () => {
      it('returns `Promise` which will resolve with `true`', () => {
        return exists({ treeIsh: 'initial' }).then((result) => {
          assert(result === true);
        }, shouldNotBeRejected);
      });
    });
    context('when tree-ish does not exist:', () => {
      it('returns `Promise` which will resolve with `false`', () => {
        return exists({ treeIsh: 'nonexistent' }).then((result) => {
          assert(result === false);
        }, shouldNotBeRejected);
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
      context('and when `process.cwd()` is inside the git project:', () => {
        it('resolves as usual', () => {
          process.chdir(__dirname);
          return exists({ treeIsh: 'initial' }).then((result) => {
            assert(result === true);
          }, shouldNotBeRejected);
        });
      });
      context('and when `process.cwd()` is outside the git project:', () => {
        it('returns `Promise` which will reject with Error', () => {
          process.chdir(os.tmpdir());
          return exists({ treeIsh: 'initial' }).then(shouldNotBeResolved, (err) => {
            assert(err);
            assert(err.message === 'Git project root does not found');
          });
        });
      });
    });
    context('when specified `gitRoot` is pointing to git project root and `treeIsh` exists too:', () => {
      it('returns `Promise` which will resolve with `true`', () => {
        const gitRoot = path.join(__dirname, '..');
        return exists({ treeIsh: 'initial', gitRoot }).then((result) => {
          assert(result === true);
        }, shouldNotBeRejected);
      });
    });
    context('when specified `gitRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will resolve with `false`', () => {
        return exists({ treeIsh: 'initial', gitRoot: os.tmpdir() }).then((result) => {
          assert(result === false);
        }, shouldNotBeRejected);
      });
    });
    context('when specified `gitRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return exists({ treeIsh: 'initial', gitRoot: path.join(os.tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
  });
});
