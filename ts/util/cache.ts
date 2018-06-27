import * as fs from 'fs';
// const fs = require('fs');
import * as fsExtra from 'fs-extra';
// const fsExtra = require('fs-extra');
const osHomedir = require('os-homedir');
import * as path from 'path';
const cachePath = path.resolve('elm-stuff', '.elm-analyse');
const packageJsonPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'package.json'
);
const elmAnalyseVersion = require(packageJsonPath).version;

var major: string;
if (elmAnalyseVersion.split('.')[0] === '0') {
    major = '0.' + elmAnalyseVersion.split('.')[1];
} else {
    major = elmAnalyseVersion.split('.')[0];
}
const globalCachePath: string = path.resolve(
    osHomedir(),
    '.elm-analyse',
    major
);

function readPackageDependencyInfo(cb: ((err: any, result: any) => void)) {
    fs.readFile(path.resolve(globalCachePath, 'all-packages.json'), function(
        err,
        data
    ) {
        if (err) {
            cb(err, undefined);
        } else {
            const s = data.toString();
            var parsed;
            try {
                parsed = JSON.parse(s);
            } catch (e) {
                cb(e, undefined);
                return;
            }
            cb(null, parsed);
        }
    });
}

function storePackageDependencyInfo(data: any) {
    fs.writeFile(
        path.resolve(globalCachePath, 'all-packages.json'),
        JSON.stringify(data),
        function() {}
    );
}
function readDependencyJson(
    dependency: string,
    version: string,
    cb: (err: NodeJS.ErrnoException, data: Buffer) => void
) {
    //TODO Error handling

    fs.readFile(
        path.resolve(
            globalCachePath,
            'interfaces',
            dependency,
            version,
            'dependency.json'
        ),
        cb
    );
}

//TODO Make content Object
function storeShaJson(sha1: string, content: string) {
    fs.writeFile(
        path.resolve(cachePath, '_shas', sha1 + '.json'),
        content,
        function() {}
    );
}

function storeDependencyJson(
    dependency: string,
    version: string,
    content: string
) {
    const targetDir = path.resolve(
        globalCachePath,
        'interfaces',
        dependency,
        version
    );
    const targetPath = path.resolve(targetDir, 'dependency.json');

    fsExtra.ensureDirSync(targetDir);
    //TODO Hanlding
    fs.writeFile(targetPath, content, function() {});
}

function elmCachePathForSha(sha: string) {
    return path.resolve(cachePath, '_shas', sha + '.elma');
}

function astCachePathForSha(sha: string): string {
    return path.resolve(cachePath, '_shas', sha + '.json');
}

function hasAstForSha(sha: string): boolean {
    return fs.existsSync(astCachePathForSha(sha));
}

function readAstForSha(sha: string): string {
    return fs.readFileSync(astCachePathForSha(sha)).toString();
}

function setupShaFolder(): void {
    fsExtra.ensureDirSync(path.resolve(cachePath, '_shas'));
}

export {
    storeShaJson,
    readDependencyJson,
    readPackageDependencyInfo,
    storePackageDependencyInfo,
    storeDependencyJson,
    hasAstForSha,
    elmCachePathForSha,
    readAstForSha,
    setupShaFolder
};
