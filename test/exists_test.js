'use strict';

delete require.cache[require.resolve('..')];
const { exists } = require('..');
const assert = require('assert');

function shouldNotBeRejected (args) {
  assert(false, 'should not be rejected: ' + args);
}

describe('git-treeish-exists', () => {
  it('resolves true when tree-ish exists', () => {
    return exists('initial').then((result) => {
      assert(result === true);
    }, shouldNotBeRejected);
  });
  it('resolves false when tree-ish does not exist', () => {
    return exists('nonexistent').then((result) => {
      assert(result === false);
    }, shouldNotBeRejected);
  });
});
