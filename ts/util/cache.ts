import * as fs from 'fs';
// const fs = require('fs');
import * as fsExtra from 'fs-extra';
// const fsExtra = require('fs-extra');
const osHomedir = require('os-homedir');
import * as path from 'path';
const packageJsonPath = path.resolve(__dirname, '..', '..', '..', 'package.json');
const elmAnalyseVersion = require(packageJsonPath).version;

class LocalCache {
    private cachePath: string;
    constructor(projectPath: string) {
        this.cachePath = path.join(projectPath, 'elm-stuff', '.elm-analyse');
    }
    public storeShaJson(sha1: string, content: JSON) {
        fs.writeFile(path.resolve(this.cachePath, '_shas', sha1 + '.json'), JSON.stringify(content), function() {});
    }
    public elmCachePathForSha(sha: string) {
        return path.resolve(this.cachePath, '_shas', sha + '.elma');
    }

    public astCachePathForSha(sha: string): string {
        return path.resolve(this.cachePath, '_shas', sha + '.json');
    }
    public setupShaFolder(): void {
        fsExtra.ensureDirSync(path.resolve(this.cachePath, '_shas'));
    }
    public hasAstForSha(sha: string): boolean {
        return fs.existsSync(this.astCachePathForSha(sha));
    }

    public readAstForSha(sha: string): string {
        return fs.readFileSync(this.astCachePathForSha(sha)).toString();
    }
}
var major: string;
if (elmAnalyseVersion.split('.')[0] === '0') {
    major = '0.' + elmAnalyseVersion.split('.')[1];
} else {
    major = elmAnalyseVersion.split('.')[0];
}
const globalCachePath: string = path.resolve(osHomedir(), '.elm-analyse', major);

function readPackageDependencyInfo(cb: ((err: any, result: any) => void)) {
    fs.readFile(path.resolve(globalCachePath, 'all-packages.json'), function(err, data) {
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
    fs.writeFile(path.resolve(globalCachePath, 'all-packages.json'), JSON.stringify(data), function() {});
}
function readDependencyJson(dependency: string, version: string, cb: (err: NodeJS.ErrnoException | null, data: Buffer) => void) {
    //TODO Error handling

    fs.readFile(path.resolve(globalCachePath, 'interfaces', dependency, version, 'dependency.json'), cb);
}

function storeDependencyJson(dependency: string, version: string, content: string) {
    const targetDir = path.resolve(globalCachePath, 'interfaces', dependency, version);
    const targetPath = path.resolve(targetDir, 'dependency.json');

    fsExtra.ensureDirSync(targetDir);
    //TODO Hanlding
    fs.writeFile(targetPath, content, function() {});
}

export { readDependencyJson, readPackageDependencyInfo, storePackageDependencyInfo, storeDependencyJson, LocalCache };
