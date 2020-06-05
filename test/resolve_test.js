'use strict';

delete require.cache[require.resolve('..')];
const { resolveGitRoot } = require('..');
const assert = require('assert').strict;
const os = require('os');
const fs = require('fs');
const path = require('path');
const findRoot = require('find-root');
const gitRoot = findRoot(process.cwd(), (dir) => fs.existsSync(path.join(dir, '.git')));
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

describe('resolveGitRoot([spawnOptions]): Resolves the absolute path of the top-level directory of the working tree', () => {
  context('when the current working directory is inside the work tree of the repository:', () => {
    describe('returns `Promise` which will resolve with the absolute path of the top-level directory of the working tree', () => {
      context('when `spawnOptions` is omitted:', () => {
        it('resolve with absolute path of the top-level directory', () => {
          return resolveGitRoot().then((dir) => {
            assert(dir === gitRoot);
          }, shouldNotBeRejected);
        });
      });
      context('when cwd is the top-level directory of the working tree:', () => {
        it('resolve with absolute path of the top-level directory (that is absolute path of cwd)', () => {
          const spawnOptions = {
            cwd: path.join(__dirname, '..')
          };
          return resolveGitRoot(spawnOptions).then((dir) => {
            assert(dir === gitRoot);
          }, shouldNotBeRejected);
        });
      });
      context('when cwd is the child directory of the top-level directory of the working tree:', () => {
        it('resolve with absolute path of parent directory', () => {
          const spawnOptions = {
            cwd: __dirname
          };
          return resolveGitRoot(spawnOptions).then((dir) => {
            assert(dir === gitRoot);
          }, shouldNotBeRejected);
        });
      });
    });
  });
  context('when the current working directory is not a git repository (or any of the parent directories):', () => {
    it('returns `Promise` which will reject with Error', () => {
      const spawnOptions = {
        cwd: os.tmpdir()
      };
      return resolveGitRoot(spawnOptions).then(shouldNotBeResolved, (err) => {
        assert(err);
        assert(err.message === 'process exited with code 128: "fatal: not a git repository (or any of the parent directories): .git"');
      });
    });
  });
  context('when the cwd option of `spawnOptions` is pointing to directory that does not exist:', () => {
    it('returns `Promise` which will reject with Error', () => {
      const spawnOptions = {
        cwd: path.join(os.tmpdir(), ymd())
      };
      return resolveGitRoot(spawnOptions).then(shouldNotBeResolved, (err) => {
        assert(err);
        assert(err.message === 'spawn git ENOENT');
      });
    });
  });
});
