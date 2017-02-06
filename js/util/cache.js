var fs = require('fs');
var cp = require('child_process');

function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile('./elm-stuff/elm-analyse/' + dependency + "/" + version + "/dependency.json", cb);
}

function storeShaJson(sha1, content) {
    fs.writeFile('./elm-stuff/elm-analyse/_shas/' + sha1 + ".json", content, function() {});
}

function storeDependencyJson(dependency, version, content) {
    cp.execSync('mkdir -p ' + './elm-stuff/elm-analyse/' + dependency + "/" + version);
    fs.writeFile('./elm-stuff/elm-analyse/' + dependency + "/" + version + "/dependency.json", content, function() {});
}

function elmCachePathForSha(sha) {
    return './elm-stuff/elm-analyse/_shas/' + sha + '.elm'
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
  cp.execSync('mkdir -p ./elm-stuff/elm-analyse/_shas');
}

module.exports = {
    storeShaJson: storeShaJson,
    readDependencyJson: readDependencyJson,
    storeDependencyJson: storeDependencyJson,
    hasAstForSha: hasAstForSha,
    elmCachePathForSha: elmCachePathForSha,
    jsonCachePathForSha: astCachePathForSha,
    setupShaFolder : setupShaFolder
}
