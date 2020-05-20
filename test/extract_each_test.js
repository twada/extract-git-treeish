'use strict';

delete require.cache[require.resolve('..')];
const { extractEach } = require('..');
const assert = require('assert').strict;
const fs = require('fs');
const { join } = require('path');
const os = require('os');
const findRoot = require('find-root');
const zf = (n, len = 2) => String(n).padStart(len, '0');
const ymd = (d = new Date()) => `${d.getFullYear()}${zf(d.getMonth() + 1)}${zf(d.getDate())}${zf(d.getHours())}${zf(d.getMinutes())}${zf(d.getSeconds())}${zf(d.getMilliseconds(), 3)}`;

describe('extract-each-git-treeish', () => {
  let dest;
  let extractions;
  beforeEach(() => {
    dest = join(os.tmpdir(), ymd());
    assert(!fs.existsSync(dest));
    const gitRoot = findRoot(process.cwd(), (dir) => fs.existsSync(join(dir, '.git')));
    extractions = extractEach({ treeIshes: ['initial', 'master'], dest, gitRoot }).extractions;
  });
  describe('returned request object', () => {
    it('`.extractions` is an array of promises', () => {
      assert(Array.isArray(extractions));
      return Promise.all(extractions);
    });
    it('each result of `.extractions` is an extraction object containing `treeIsh` and `dir`', () => {
      const masterDir = join(dest, 'master');
      const initialDir = join(dest, 'initial');
      return Promise.all(extractions).then((extractions) => {
        assert(extractions.some(e => (e.treeIsh === 'master' && e.dir === masterDir)));
        assert(extractions.some(e => (e.treeIsh === 'initial' && e.dir === initialDir)));
      });
    });
  });
  it('creates `dest` if does not exist', () => {
    return Promise.all(extractions).then(() => {
      assert(fs.existsSync(dest));
    });
  });
  it('extracts treeish to directory with its name', () => {
    return Promise.all(extractions).then(() => {
      assert(fs.existsSync(join(dest, 'master')));
      assert(fs.existsSync(join(dest, 'initial')));
    });
  });
});
