'use strict';

delete require.cache[require.resolve('..')];
const { extractEach } = require('..');
const assert = require('assert');
const fs = require('fs');
const { join } = require('path');
const os = require('os');
const findRoot = require('find-root');
const randomstring = require('randomstring');
const generateName = () => {
  return randomstring.generate({
    length: 12,
    charset: 'alphabetic'
  });
};

describe('extract-each-git-treeish', () => {
  let destinationDir;
  let request;
  beforeEach(() => {
    destinationDir = join(os.tmpdir(), generateName());
    assert(!fs.existsSync(destinationDir));
    const gitRoot = findRoot(process.cwd(), (dir) => fs.existsSync(join(dir, '.git')));
    request = extractEach({ treeIshNames: ['initial', 'master'], destinationDir, gitRoot });
  });
  describe('returned request object', () => {
    it('`.promises` is an array of promises', () => {
      assert(Array.isArray(request.promises));
      return Promise.all(request.promises);
    });
    it('each result of `.promises` is an extraction object containing `treeIsh` and `dir`', () => {
      const masterDir = join(destinationDir, 'master');
      const initialDir = join(destinationDir, 'initial');
      return Promise.all(request.promises).then((extractions) => {
        assert(extractions.some(e => (e.treeIsh === 'master' && e.dir === masterDir)));
        assert(extractions.some(e => (e.treeIsh === 'initial' && e.dir === initialDir)));
      });
    });
  });
  it('creates `destinationDir` if does not exist', () => {
    return Promise.all(request.promises).then(() => {
      assert(fs.existsSync(destinationDir));
    });
  });
  it('extracts treeish to directory with its name', () => {
    return Promise.all(request.promises).then(() => {
      assert(fs.existsSync(join(destinationDir, 'master')));
      assert(fs.existsSync(join(destinationDir, 'initial')));
    });
  });
});