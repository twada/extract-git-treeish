'use strict';

const { spawn } = require('child_process');

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
  exists
};
