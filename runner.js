const fs = require('fs');
const Elm = require('./elm');
const walk = require('walk');
const walker = walk.walk("/tmp", { followLinks: false })
const cp = require('child_process');

var targetFiles = cp.execSync('find ../elm-format-package-repo-stats/repos -name "*.elm" -type f').toString().split('\n').filter(x => x.length > 0);

targetFiles = targetFiles.map(function(f) {
  var stats = fs.statSync(f);
  var fileSizeInBytes = stats["size"];
  return [f, fileSizeInBytes];
}).filter(x => x).sort((x,y) => x[1] - y[1]).slice(0,1000);

var app = Elm.Main.worker();

var counter = 0;
var failed = 0;
app.ports.parseResponse.subscribe(function(result) {
  counter ++;
  if (result[1] === 'Nothing') {
    console.log(counter +' Analysed file:', result[0], 'in milliseconds ' + result[2]);
    console.log('  > Failed');
        failed ++;
  }

  analyseNextFile();
});

function analyseNextFile() {
  const next = targetFiles.shift();
  if (!next ) {
    console.log('Failed:', failed);
    console.log('Counter:', counter);
    return;
  }
  if (next[1] > 10 * 1024) {
    console.log("Skip file due to greater than 10kb");
    analyseNextFile();
    return;
  }

  const content = fs.readFileSync(next[0], {encoding : 'utf-8'}).toString();
  app.ports.onFile.send([next[0],content]);
}

analyseNextFile();
