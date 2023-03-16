'use strict';

const child_process = require('child_process');
const fs = require('fs');
const path = require('path');
const tar = require('tar');

const prepareDestDir = (dir) => {
    return new Promise((resolve, reject) => {
        fs.readdir(dir, (err, files) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    fs.mkdir(dir, { recursive: true }, (e) => e ? reject(e) : resolve());
                }
                else {
                    reject(err);
                }
            }
            else {
                if (files.length === 0) {
                    resolve();
                }
                else {
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
                }
                else {
                    findGitProjectRoot(dir).then(resolve, reject);
                }
            }
            else {
                resolve(from);
            }
        });
    });
};
const describe = (arg) => arg === null ? 'null' : 'type ' + typeof arg;
function mandatoryString(argName, actualArg) {
    if (typeof actualArg !== 'string') {
        throw new TypeError(`The "${argName}" argument must be of type string. Received ${describe(actualArg)}`);
    }
}
function optionalString(argName, actualArg) {
    typeof actualArg !== 'undefined' && mandatoryString(argName, actualArg);
}
function extract({ treeIsh, dest, gitProjectRoot, spawnOptions }) {
    mandatoryString('treeIsh', treeIsh);
    mandatoryString('dest', dest);
    optionalString('gitProjectRoot', gitProjectRoot);
    const found = gitProjectRoot ? Promise.resolve(gitProjectRoot) : findGitProjectRoot();
    return found.then((projectRoot) => {
        const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
        return new Promise((resolve, reject) => {
            return exists({ treeIsh, gitProjectRoot: projectRoot, spawnOptions: sOpts }).then((exists) => {
                if (!exists) {
                    reject(new Error(`Specified <tree-ish> does not exist [${treeIsh}]`));
                    return;
                }
                prepareDestDir(dest).then(() => {
                    const gitArchive = child_process.spawn('git', ['archive', treeIsh], sOpts);
                    gitArchive.on('error', reject);
                    gitArchive.stdout.pipe(tar.x({ C: dest }))
                        .on('error', reject)
                        .on('close', (code, signal) => resolve({ treeIsh, dir: dest }));
                }, reject);
            }, reject);
        });
    });
}
function exists({ treeIsh, gitProjectRoot, spawnOptions }) {
    mandatoryString('treeIsh', treeIsh);
    optionalString('gitProjectRoot', gitProjectRoot);
    const found = gitProjectRoot ? Promise.resolve(gitProjectRoot) : findGitProjectRoot();
    return found.then((projectRoot) => {
        const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
        return new Promise((resolve, reject) => {
            child_process.spawn('git', ['rev-parse', '--verify', '--quiet', treeIsh], sOpts)
                .on('error', reject)
                .on('close', (code, signal) => resolve(code === 0));
        });
    });
}

exports.exists = exists;
exports.extract = extract;
