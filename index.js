'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const { join } = require('path');
const tar = require('tar');
const mkdirp = (destinationDir) => {
  return new Promise((resolve, reject) => {
    fs.mkdir(destinationDir, { recursive: true }, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    });
  });
};

function extractEach ({ treeIshNames, destinationDir, gitRoot }) {
  return {
    promises: treeIshNames.map((treeIshName) => {
      const treeIshDestDir = join(destinationDir, treeIshName);
      return mkdirp(treeIshDestDir).then(() => {
        return extract(treeIshName, treeIshDestDir, {
          cwd: gitRoot
        });
      });
    })
  };
}

function extract (treeIshName, destinationDir, spawnOptions) {
  return new Promise((resolve, reject) => {
    fs.access(destinationDir, fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        return reject(err);
      }
      return exists(treeIshName, spawnOptions).then((exists) => {
        if (!exists) {
          return reject(new Error(`Specified <tree-ish> [${treeIshName}] does not exist`));
        }
        return spawn('git', ['archive', treeIshName], spawnOptions).stdout.pipe(tar.x({ C: destinationDir }))
          .on('error', (err) => {
            reject(err);
          })
          .on('close', (code, signal) => {
            resolve({ treeIsh: treeIshName, dir: destinationDir });
          });
      }).catch((err) => reject(err));
    });
  });
}

function exists (treeIshName, spawnOptions) {
  return new Promise((resolve, reject) => {
    spawn('git', ['rev-parse', '--verify', '--quiet', treeIshName], spawnOptions)
      .on('error', (err) => {
        reject(err);
      })
      .on('close', (code, signal) => {
        if (code === 0) {
          return resolve(true);
        }
        return resolve(false);
      });
  });
}

module.exports = {
  extractEach,
  extract,
  exists
};
