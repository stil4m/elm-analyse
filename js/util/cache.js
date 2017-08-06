const fs = require("fs");
const fsExtra = require("fs-extra");
const osHomedir = require("os-homedir");

const cachePath = "./elm-stuff/.elm-analyse";
const elmAnalyseVersion = require("../../package.json").version;
var major;
if (elmAnalyseVersion.split(".")[0] === "0") {
    major = "0." + elmAnalyseVersion.split(".")[1];
} else {
    major = elmAnalyseVersion.split(".")[0];
}
const globalCachePath = osHomedir() + "/.elm-analyse/" + major;

function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile(
        globalCachePath +
            "/interfaces/" +
            dependency +
            "/" +
            version +
            "/dependency.json",
        cb
    );
}

function storeShaJson(sha1, content) {
    fs.writeFile(
        cachePath + "/_shas/" + sha1 + ".json",
        content,
        function() {}
    );
}

function storeDependencyJson(dependency, version, content) {
    const targetDir =
        globalCachePath + "/interfaces/" + dependency + "/" + version;
    fsExtra.ensureDirSync(targetDir);
    fs.writeFile(targetDir + "/dependency.json", content, function() {});
}

function elmCachePathForSha(sha) {
    return cachePath + "/_shas/" + sha + ".elma";
}

function astCachePathForSha(sha) {
    return cachePath + "/_shas/" + sha + ".json";
}

function hasAstForSha(sha) {
    return fs.existsSync(astCachePathForSha(sha));
}

function readAstForSha(sha) {
    return fs.readFileSync(astCachePathForSha(sha)).toString();
}

function setupShaFolder() {
    fsExtra.ensureDirSync(cachePath + "/_shas");
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
