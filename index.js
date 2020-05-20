'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const tar = require('tar');
const mkdirp = (dir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(dir, { recursive: true }, (err) => err ? reject(err) : resolve());
  });
};

function extractEach ({ treeIshes, dest, gitRoot, spawnOptions }) {
  const sOpts = Object.assign({}, { cwd: gitRoot }, spawnOptions);
  return {
    extractions: treeIshes.map((treeIsh) => {
      return extract({ treeIsh, dest: join(dest, treeIsh), spawnOptions: sOpts });
    })
  };
}

function extract ({ treeIsh, dest, gitRoot, spawnOptions }) {
  const sOpts = Object.assign({}, { cwd: gitRoot }, spawnOptions);
  return new Promise((resolve, reject) => {
    return exists({ treeIsh, spawnOptions: sOpts }).then((exists) => {
      if (!exists) {
        reject(new Error(`Specified <tree-ish> [${treeIsh}] does not exist`));
        return;
      }
      mkdirp(dest).then(() => {
        spawn('git', ['archive', treeIsh], sOpts).stdout.pipe(tar.x({ C: dest }))
          .on('error', reject)
          .on('close', (code, signal) => resolve({ treeIsh, dir: dest }));
      }, reject);
    });
  });
}

function exists ({ treeIsh, gitRoot, spawnOptions }) {
  const sOpts = Object.assign({}, { cwd: gitRoot }, spawnOptions);
  return new Promise((resolve, reject) => {
    spawn('git', ['rev-parse', '--verify', '--quiet', treeIsh], sOpts)
      .on('error', reject)
      .on('close', (code, signal) => resolve(code === 0));
  });
}

module.exports = {
  extractEach,
  extract,
  exists
};
