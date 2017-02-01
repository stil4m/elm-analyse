// Reference the module
const normalizeNewline = require('normalize-newline');
const sha1 = require('sha1');
const fs = require('fs');
const cp = require('child_process');


function isFormatted (path) {
  try {
    cp.execSync('elm-format --validate ' + path, {
      stdio:[]
    });
    return true;
  } catch (e) {
    return false;
  }
}

function readFile(directory, path, cb) {
  console.log("Load file", path, "...")
  const real = path.replace(".", directory);

  fs.readFile(real, function(e, content) {
    if (e) {
      cb({
        success : false,
        path : path,
        sha1 : null,
        content : null,
        formatted : false
      })
      return;
    }
    const originalContent= content.toString();
    const normalized = normalizeNewline(originalContent);
    const fileName = sha1(originalContent);
    console.log(fileName);
    const fullPath ='./cache/' + fileName + '.elm';
    fs.writeFileSync(fullPath , normalized);
    const formatted = isFormatted(fullPath);

    cb({
      success : true,
      path : real,
      sha1 : fileName,
      content : normalized,
      formatted : formatted
    });
  })
}

module.exports = readFile;
