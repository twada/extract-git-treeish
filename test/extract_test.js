'use strict';

delete require.cache[require.resolve('..')];
const { extract } = require('..');
const assert = require('assert').strict;
const os = require('os');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const zf = (n, len = 2) => String(n).padStart(len, '0');
const ymd = (d = new Date()) => `${d.getFullYear()}${zf(d.getMonth() + 1)}${zf(d.getDate())}${zf(d.getHours())}${zf(d.getMinutes())}${zf(d.getSeconds())}${zf(d.getMilliseconds(), 3)}`;
const fail = (args) => {
  console.error(args);
  assert(false, 'should not be here');
};

describe('extract-git-treeish', () => {
  let targetDir;
  beforeEach(() => {
    targetDir = path.join(os.tmpdir(), ymd());
  });
  afterEach(() => {
    if (fs.existsSync(targetDir)) {
      rimraf.sync(targetDir);
    }
  });
  it('resolves when succeeded', () => {
    return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
      assert.deepStrictEqual(result, {
        treeIsh: 'initial',
        dir: targetDir
      });
    });
  });
  it('creates `destinationDir` if does not exist', () => {
    return extract({ treeIsh: 'initial', dest: targetDir }).then((result) => {
      assert(fs.existsSync(targetDir));
    });
  });
  it('rejects when treeIshName does not exist', () => {
    return extract({ treeIsh: 'nonexistent', dest: targetDir }).then(fail, (err) => {
      assert(err);
      assert(err.message = 'Specified <tree-ish> [nonexistent] does not exist');
    });
  });
  it('rejects when failed to create `destinationDir`', () => {
    fs.closeSync(fs.openSync(targetDir, 'w'));
    return extract({ treeIsh: 'initial', dest: targetDir }).then(fail, (err) => {
      assert(err);
      assert(err.code === 'EEXIST');
    });
  });
});
