'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const tar = require('tar');

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
    spawn('git', ['rev-parse', '--verify', treeIshName], spawnOptions)
      .on('error', (err) => {
        reject(err);
      })
      .on('close', (code, signal) => {
        if (code === 128) {
          return resolve(false);
        } else if (code !== 0) {
          return reject(new Error(`Error while \`git rev-parse --verify ${treeIshName}\``));
        }
        return resolve(true);
      });
  });
}

module.exports = {
  extract,
  exists
};
