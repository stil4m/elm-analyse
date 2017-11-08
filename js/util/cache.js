const fs = require('fs');
const fsExtra = require('fs-extra');
const osHomedir = require('os-homedir');
const path = require('path');
const cachePath = path.resolve('elm-stuff', '.elm-analyse');
const packageJsonPath = path.resolve(__dirname, '..', '..', 'package.json');
const elmAnalyseVersion = require(packageJsonPath).version;

var major;
if (elmAnalyseVersion.split('.')[0] === '0') {
    major = '0.' + elmAnalyseVersion.split('.')[1];
} else {
    major = elmAnalyseVersion.split('.')[0];
}
const globalCachePath = path.resolve(osHomedir(), '.elm-analyse', major);

function readDependencyJson(dependency, version, cb) {
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

function storeShaJson(sha1, content) {
    fs.writeFile(
        path.resolve(cachePath, '_shas', sha1 + '.json'),
        content,
        function() {}
    );
}

function storeDependencyJson(dependency, version, content) {
    const targetDir = path.resolve(
        globalCachePath,
        'interfaces',
        dependency,
        version
    );
    const targetPath = path.resolve(targetDir, 'dependency.json');

    fsExtra.ensureDirSync(targetDir);
    fs.writeFile(targetPath, content, function() {});
}

function elmCachePathForSha(sha) {
    return path.resolve(cachePath, '_shas', sha + '.elma');
}

function astCachePathForSha(sha) {
    return path.resolve(cachePath, '_shas', sha + '.json');
}

function hasAstForSha(sha) {
    return fs.existsSync(astCachePathForSha(sha));
}

function readAstForSha(sha) {
    return fs.readFileSync(astCachePathForSha(sha)).toString();
}

function setupShaFolder() {
    fsExtra.ensureDirSync(path.resolve(cachePath, '_shas'));
}

module.exports = {
    storeShaJson: storeShaJson,
    readDependencyJson: readDependencyJson,
    storeDependencyJson: storeDependencyJson,
    hasAstForSha: hasAstForSha,
    elmCachePathForSha: elmCachePathForSha,
    jsonCachePathForSha: astCachePathForSha,
    readAstForSha: readAstForSha,
    setupShaFolder: setupShaFolder
};
