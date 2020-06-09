'use strict';

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
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
const findGitProjectRoot = (from = process.cwd()) => {
  return new Promise((resolve, reject) => {
    fs.access(path.join(from, '.git'), fs.constants.F_OK | fs.constants.R_OK, (err) => {
      if (err) {
        const { dir, root } = path.parse(from);
        if (dir === root) {
          reject(new Error('Git project root does not found'));
        } else {
          findGitProjectRoot(dir).then(resolve, reject);
        }
      } else {
        resolve(from);
      }
    });
  });
};

function extract ({ treeIsh, dest, gitRoot, spawnOptions }) {
  const found = gitRoot ? Promise.resolve(gitRoot) : findGitProjectRoot();
  return found.then((projectRoot) => {
    const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
    return new Promise((resolve, reject) => {
      return exists({ treeIsh, gitRoot: projectRoot, spawnOptions: sOpts }).then((exists) => {
        if (!exists) {
          reject(new Error(`Specified <tree-ish> does not exist [${treeIsh}]`));
          return;
        }
        mkdirp(dest).then(() => {
          const gitArchive = spawn('git', ['archive', treeIsh], sOpts);
          gitArchive.on('error', reject);
          gitArchive.stdout.pipe(tar.x({ C: dest }))
            .on('error', reject)
            .on('close', (code, signal) => resolve({ treeIsh, dir: dest }));
        }, reject);
      }, reject);
    });
  });
}

function exists ({ treeIsh, gitRoot, spawnOptions }) {
  const found = gitRoot ? Promise.resolve(gitRoot) : findGitProjectRoot();
  return found.then((projectRoot) => {
    const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
    return new Promise((resolve, reject) => {
      spawn('git', ['rev-parse', '--verify', '--quiet', treeIsh], sOpts)
        .on('error', reject)
        .on('close', (code, signal) => resolve(code === 0));
    });
  });
}

module.exports = {
  extract,
  exists
};
