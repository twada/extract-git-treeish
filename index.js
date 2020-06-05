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

function resolveGitRoot (spawnOptions) {
  return new Promise((resolve, reject) => {
    let done, ok, ng;
    const gitRevParse = spawn('git', ['rev-parse', '--show-toplevel'], spawnOptions);
    gitRevParse.on('error', (err) => {
      if (done) return;
      done = true;
      reject(err);
    });
    gitRevParse.on('close', (code, signal) => {
      if (done) return;
      done = true;
      if (code === 0 && ok) {
        resolve(ok);
      } else {
        reject(new Error(`process exited with code ${code}: "${ng}"`));
      }
    });
    gitRevParse.stdout.on('data', (data) => {
      ok = String(data).trim();
    });
    gitRevParse.stderr.on('data', (data) => {
      ng = String(data).trim();
    });
  });
}

module.exports = {
  resolveGitRoot,
  extract,
  exists
};
