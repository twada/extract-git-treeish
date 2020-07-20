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

describe('`exists({ treeIsh, [gitProjectRoot], [spawnOptions] })`: Inquires for existence of `treeIsh`', () => {
  describe('returns `Promise` which will:', () => {
    it('resolve with `true` when tree-ish exists', () => {
      return exists({ treeIsh: 'initial' }).then((result) => {
        assert(result === true);
      }, shouldNotBeRejected);
    });
    it('resolve with `false` when tree-ish does not exist', () => {
      return exists({ treeIsh: 'nonexistent' }).then((result) => {
        assert(result === false);
      }, shouldNotBeRejected);
    });
  });
  describe('`treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be inquired', () => {
    context('when `treeIsh` argument is omitted:', () => {
      it('throw TypeError', () => {
        assert.throws(() => {
          exists({ });
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
          exists({ treeIsh: 1234 });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "treeIsh" argument must be of type string. Received type number');
          return true;
        });
      });
    });
  });
  describe('`gitProjectRoot`(string) is an optional directory path pointing to top level directory of git project', () => {
    context('when `gitProjectRoot` option is omitted:', () => {
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
    context('when specified `gitProjectRoot` is pointing to git project root:', () => {
      it('resolves as usual', () => {
        const gitProjectRoot = path.join(__dirname, '..');
        return exists({ treeIsh: 'initial', gitProjectRoot }).then((result) => {
          assert(result === true);
        }, shouldNotBeRejected);
      });
    });
    context('when specified `gitProjectRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will resolve with `false`', () => {
        return exists({ treeIsh: 'initial', gitProjectRoot: os.tmpdir() }).then((result) => {
          assert(result === false);
        }, shouldNotBeRejected);
      });
    });
    context('when specified `gitProjectRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return exists({ treeIsh: 'initial', gitProjectRoot: path.join(os.tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
    context('when `gitProjectRoot` argument is not a string:', () => {
      it('throw TypeError when number', () => {
        assert.throws(() => {
          exists({ treeIsh: 'initial', gitProjectRoot: 1234 });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "gitProjectRoot" argument must be of type string. Received type number');
          return true;
        });
      });
      it('throw TypeError when boolean', () => {
        assert.throws(() => {
          exists({ treeIsh: 'initial', gitProjectRoot: false });
        }, (err) => {
          assert(err instanceof TypeError);
          assert(err.message === 'The "gitProjectRoot" argument must be of type string. Received type boolean');
          return true;
        });
      });
    });
  });
});
