'use strict';

delete require.cache[require.resolve('..')];
const { extract } = require('..');
const assert = require('assert');
const os = require('os');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const rimraf = require('rimraf');
const randomstring = require('randomstring');
const fail = (args) => {
  assert(false, 'should not be here: ' + args);
};
const generateName = () => {
  return randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
};

describe('extract-git-treeish', () => {
  let targetDir;
  beforeEach(() => {
    targetDir = path.join(os.tmpdir(), generateName());
    mkdirp.sync(targetDir);
  });
  afterEach(() => {
    if (fs.existsSync(targetDir)) {
      rimraf.sync(targetDir);
    }
  });
  it('resolves when succeeded', () => {
    return extract('initial', targetDir).then((result) => {
      assert.deepStrictEqual(result, {
        treeIsh: 'initial',
        dir: targetDir
      });
    });
  });
  it('rejects when destinationDir does not exist', () => {
    rimraf.sync(targetDir);
    return extract('initial', targetDir).then(fail, (err) => {
      assert(err);
      assert(err.code === 'ENOENT');
    });
  });
  it('rejects when treeIshName does not exist', () => {
    return extract('nonexistent', targetDir).then(fail, (err) => {
      assert(err);
      assert(err.message = 'Specified <tree-ish> [nonexistent] does not exist');
    });
  });
});
