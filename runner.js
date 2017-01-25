const fs = require('fs');
const Elm = require('./elm');
const walk = require('walk');
const walker = walk.walk("/tmp", {
    followLinks: false
})
const cp = require('child_process');

var targetFiles = cp.execSync('find ../elm-format-package-repo-stats/repos -name "*.elm" -type f').toString().split('\n').filter(x => x.length > 0);

targetFiles = targetFiles.map(function(f) {
        var stats = fs.statSync(f);
        var fileSizeInBytes = stats["size"];
        return [f, fileSizeInBytes];
    }).filter(x => x)
    .sort((x, y) => x[1] - y[1])
    // .slice(0, 800);

require('./fileSetAnalyser')(targetFiles);
