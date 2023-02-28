import { spawn } from 'child_process';
import { readdir, mkdir, access, constants } from 'fs';
import { join, parse } from 'path';
import { x as tarX } from 'tar';
import type { SpawnOptionsWithoutStdio } from 'child_process';

const prepareDestDir = (dir: string) => {
  return new Promise<void>((resolve, reject) => {
    readdir(dir, (err, files) => {
      if (err) {
        if (err.code === 'ENOENT') {
          mkdir(dir, { recursive: true }, (e) => e ? reject(e) : resolve());
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
  return new Promise<string>((resolve, reject) => {
    access(join(from, '.git'), constants.F_OK | constants.R_OK, (err) => {
      if (err) {
        const { dir, root } = parse(from);
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
const describe = (arg: any) => arg === null ? 'null' : 'type ' + typeof arg;
function mandatoryString(argName: string, actualArg: any): asserts actualArg is string {
  if (typeof actualArg !== 'string') {
    throw new TypeError(`The "${argName}" argument must be of type string. Received ${describe(actualArg)}`);
  }
};
function optionalString(argName: string, actualArg: any): asserts actualArg is string|undefined {
  typeof actualArg !== 'undefined' && mandatoryString(argName, actualArg);
}

type ExtractArguments = {
  treeIsh: string,
  dest: string,
  gitProjectRoot?: string,
  spawnOptions?: SpawnOptionsWithoutStdio
};
type ExtractResult = {
  treeIsh: string,
  dir: string
};
function extract ({ treeIsh, dest, gitProjectRoot, spawnOptions }: ExtractArguments): Promise<ExtractResult> {
  mandatoryString('treeIsh', treeIsh);
  mandatoryString('dest', dest);
  optionalString('gitProjectRoot', gitProjectRoot);
  const found = gitProjectRoot ? Promise.resolve(gitProjectRoot) : findGitProjectRoot();
  return found.then((projectRoot) => {
    const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
    return new Promise<ExtractResult>((resolve, reject) => {
      return exists({ treeIsh, gitProjectRoot: projectRoot, spawnOptions: sOpts }).then((exists) => {
        if (!exists) {
          reject(new Error(`Specified <tree-ish> does not exist [${treeIsh}]`));
          return;
        }
        prepareDestDir(dest).then(() => {
          const gitArchive = spawn('git', ['archive', treeIsh], sOpts);
          gitArchive.on('error', reject);
          gitArchive.stdout.pipe(tarX({ C: dest }))
            .on('error', reject)
            .on('close', (code: number, signal: NodeJS.Signals) => resolve({ treeIsh, dir: dest }));
        }, reject);
      }, reject);
    });
  });
}

type ExistsArguments = {
  treeIsh: string,
  gitProjectRoot?: string,
  spawnOptions?: SpawnOptionsWithoutStdio
};
function exists ({treeIsh, gitProjectRoot, spawnOptions}: ExistsArguments): Promise<boolean> {
  mandatoryString('treeIsh', treeIsh);
  optionalString('gitProjectRoot', gitProjectRoot);
  const found = gitProjectRoot ? Promise.resolve(gitProjectRoot) : findGitProjectRoot();
  return found.then((projectRoot) => {
    const sOpts = Object.assign({}, spawnOptions, { cwd: projectRoot });
    return new Promise<boolean>((resolve, reject) => {
      spawn('git', ['rev-parse', '--verify', '--quiet', treeIsh], sOpts)
        .on('error', reject)
        .on('close', (code: number, signal: NodeJS.Signals) => resolve(code === 0));
    });
  });
}

export {
  extract,
  exists
};
