'use strict';

delete require.cache[require.resolve('..')];
const { exists } = require('..');
const assert = require('assert').strict;

function shouldNotBeRejected (args) {
  console.error(args);
  assert(false, 'should not be rejected');
}

describe('git-treeish-exists', () => {
  it('resolves true when tree-ish exists', () => {
    return exists({ treeIsh: 'initial' }).then((result) => {
      assert(result === true);
    }, shouldNotBeRejected);
  });
  it('resolves false when tree-ish does not exist', () => {
    return exists({ treeIsh: 'nonexistent' }).then((result) => {
      assert(result === false);
    }, shouldNotBeRejected);
  });
});
