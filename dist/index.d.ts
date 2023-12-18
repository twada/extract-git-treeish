/// <reference types="node" resolution-mode="require"/>
import type { SpawnOptionsWithoutStdio } from 'child_process';
type ExtractArguments = {
    treeIsh: string;
    dest: string;
    gitProjectRoot?: string;
    spawnOptions?: SpawnOptionsWithoutStdio;
};
type ExtractResult = {
    treeIsh: string;
    dir: string;
};
declare function extract({ treeIsh, dest, gitProjectRoot, spawnOptions }: ExtractArguments): Promise<ExtractResult>;
type ExistsArguments = {
    treeIsh: string;
    gitProjectRoot?: string;
    spawnOptions?: SpawnOptionsWithoutStdio;
};
declare function exists({ treeIsh, gitProjectRoot, spawnOptions }: ExistsArguments): Promise<boolean>;
export { extract, exists };
