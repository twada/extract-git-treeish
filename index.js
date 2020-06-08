'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const tar = require('tar');
const mkdirp = (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          fs.mkdir(dir, { recursive: true }, (e) => e ? reject(e) : resolve());
        } else {
          reject(err);
        }
      } else {
        if (files.length === 0) {
          resolve();
        } else {
          reject(new Error(`Specified <dest> is not empty [${dir}]`));
        }
      }
    });
  });
};

function extract ({ treeIsh, dest, gitRoot, spawnOptions }) {
  const sOpts = Object.assign({}, { cwd: gitRoot }, spawnOptions);
  return new Promise((resolve, reject) => {
    return exists({ treeIsh, spawnOptions: sOpts }).then((exists) => {
      if (!exists) {
        reject(new Error(`Specified <tree-ish> does not exist [${treeIsh}]`));
        return;
      }
      mkdirp(dest).then(() => {
        spawn('git', ['archive', treeIsh], sOpts).stdout.pipe(tar.x({ C: dest }))
          .on('error', reject)
          .on('close', (code, signal) => resolve({ treeIsh, dir: dest }));
      }, reject);
    }, reject);
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
  extract,
  exists
};
