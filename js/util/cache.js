const fs = require('fs');
const fsExtra = require('fs-extra');
const cp = require('child_process');

function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile('./elm-stuff/elm-analyse/' + dependency + "/" + version + "/dependency.json", cb);
}

function storeShaJson(sha1, content) {
    fs.writeFile('./elm-stuff/elm-analyse/_shas/' + sha1 + ".json", content, function() {});
}

function storeDependencyJson(dependency, version, content) {
    const targetDir = './elm-stuff/elm-analyse/' + dependency + "/" + version;
    fsExtra.ensureDirSync(targetDir);
    fs.writeFile(targetDir + "/dependency.json", content, function() {});
}

function elmCachePathForSha(sha) {
    return './elm-stuff/elm-analyse/_shas/' + sha + '.elma'
}

function astCachePathForSha(sha) {
    return './elm-stuff/elm-analyse/_shas/' + sha + '.json'
}

function hasAstForSha(sha) {
    return fs.existsSync(astCachePathForSha(sha));
}

function readAstForSha(sha) {
    return fs.readFileSync(astCachePathForSha(sha)).toString();
}

function setupShaFolder() {
    fsExtra.ensureDirSync('./elm-stuff/elm-analyse/_shas');
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
}
