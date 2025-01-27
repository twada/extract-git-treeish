import { describe, it, beforeEach, afterEach } from 'node:test';
import { exists } from '../index.mjs';
import { strict as assert } from 'node:assert';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

describe('`exists({ treeIsh, [gitProjectRoot], [spawnOptions] })`: Inquires for existence of `treeIsh`', () => {
  describe('`treeIsh`(string) is a name of a git tree-ish (commit, branch, or tag) to be inquired', () => {
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
      describe('and when `process.cwd()` is inside the git project:', () => {
        it('resolves as usual', () => {
          process.chdir(__dirname);
          return exists({ treeIsh: 'initial' }).then((result) => {
            assert(result === true);
          }, shouldNotBeRejected);
        });
      });
      describe('and when `process.cwd()` is outside the git project:', () => {
        it('returns `Promise` which will reject with Error', () => {
          process.chdir(tmpdir());
          return exists({ treeIsh: 'initial' }).then(shouldNotBeResolved, (err) => {
            assert(err);
            assert(err.message === 'Git project root does not found');
          });
        });
      });
    });
    describe('when specified `gitProjectRoot` is pointing to git project root:', () => {
      it('resolves as usual', () => {
        const gitProjectRoot = join(__dirname, '..');
        return exists({ treeIsh: 'initial', gitProjectRoot }).then((result) => {
          assert(result === true);
        }, shouldNotBeRejected);
      });
    });
    describe('when specified `gitProjectRoot` is not a git repository (or any of the parent directories):', () => {
      it('returns `Promise` which will resolve with `false`', () => {
        return exists({ treeIsh: 'initial', gitProjectRoot: tmpdir() }).then((result) => {
          assert(result === false);
        }, shouldNotBeRejected);
      });
    });
    describe('when specified `gitProjectRoot` is pointing to directory that does not exist:', () => {
      it('returns `Promise` which will reject with Error', () => {
        return exists({ treeIsh: 'initial', gitProjectRoot: join(tmpdir(), ymd()) }).then(shouldNotBeResolved, (err) => {
          assert(err);
          assert(err instanceof Error);
        });
      });
    });
  });
});
