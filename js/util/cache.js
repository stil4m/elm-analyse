var fs = require('fs');

function readDependencyJson(dependency, version, cb) {
    //TODO Error handling
    fs.readFile('./cache/' + dependency + "/" + version + "/dependency.json", cb);
}

function storeShaJson(sha1, content) {
    fs.writeFile('./cache/_shas/' + sha1 + ".json", content);
}

function storeDependencyJson(dependency, version, content) {
    cp.execSync('mkdir -p ' + './cache/' + dependency + "/" + version);
    fs.writeFile('./cache/' + dependency + "/" + version + "/dependency.json", content);
}
module.exports = {
    storeShaJson: storeShaJson,
    readDependencyJson: readDependencyJson,
    storeDependencyJson: storeDependencyJson
}
