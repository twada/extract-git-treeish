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

function extractEach ({ treeIshNames, destinationDir, gitRoot, spawnOptions }) {
  const sOpts = Object.assign({}, { cwd: gitRoot }, spawnOptions);
  return {
    promises: treeIshNames.map((treeIshName) => {
      return extract(treeIshName, join(destinationDir, treeIshName), sOpts);
    })
  };
}

function extract (treeIshName, destinationDir, spawnOptions) {
  return new Promise((resolve, reject) => {
    return exists(treeIshName, spawnOptions).then((exists) => {
      if (!exists) {
        reject(new Error(`Specified <tree-ish> [${treeIshName}] does not exist`));
        return;
      }
      mkdirp(destinationDir).then(() => {
        spawn('git', ['archive', treeIshName], spawnOptions).stdout.pipe(tar.x({ C: destinationDir }))
          .on('error', reject)
          .on('close', (code, signal) => resolve({ treeIsh: treeIshName, dir: destinationDir }));
      }, reject);
    });
  });
}

function exists (treeIshName, spawnOptions) {
  return new Promise((resolve, reject) => {
    spawn('git', ['rev-parse', '--verify', '--quiet', treeIshName], spawnOptions)
      .on('error', reject)
      .on('close', (code, signal) => resolve(code === 0));
  });
}

module.exports = {
  extractEach,
  extract,
  exists
};
