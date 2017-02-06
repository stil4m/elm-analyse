// Reference the module
const normalizeNewline = require('normalize-newline');
const sha1 = require('sha1');
const fs = require('fs');
const cp = require('child_process');


function isFormatted(path) {
    try {
        cp.execSync('elm-format --validate ' + path, {
            stdio: []
        });
        return true;
    } catch (e) {
        return false;
    }
}

function readFile(directory, path, cb) {
    console.log("Load file", path, "...")
    const real = path.replace(".", directory);
    const fileName = cp.execSync('shasum ' + real).toString().match(/[a-f0-9]+/)[0];


    if (fs.existsSync('./cache/_shas/' + fileName + '.json')) {
        const fullPath = './cache/_shas/' + fileName + '.elm';
        setTimeout(function() {
            cb({
                success: true,
                path: real,
                sha1: fileName,
                content: fs.readFileSync(fullPath).toString(),
                formatted: isFormatted(fullPath),
                ast: fs.readFileSync('./cache/_shas/' + fileName + '.json').toString()
            });

        }, 1);
        return;
    }

    fs.readFile(real, function(e, content) {
        if (e) {
            cb({
                success: false,
                path: path,
                sha1: null,
                content: null,
                formatted: false,
                ast: null
            })
            return;
        }
        const originalContent = content.toString();
        const normalized = normalizeNewline(originalContent);
        const fullPath = './cache/_shas/' + fileName + '.elm';

        fs.writeFileSync(fullPath, normalized);
        const formatted = isFormatted(fullPath);

        cb({
            success: true,
            path: real,
            sha1: fileName,
            content: normalized,
            formatted: formatted,
            ast: null
        });
    })
}
cp.execSync('mkdir -p ./cache/_shas');
module.exports = readFile;
