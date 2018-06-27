var modConcat = require('node-module-concat');
var outputFile = './dist/public/editor-elm.js';
var fs = require('fs');
modConcat('./dist/app/editor/editor.js', outputFile, function(err, stats) {
    if (err) {
        console.log(err);
        process.exit(1);
    }
    console.log(stats.files.length + ' were combined into ' + outputFile);
    process.exit(0);
});
