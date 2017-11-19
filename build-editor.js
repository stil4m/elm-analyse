var modConcat = require('node-module-concat');
var outputFile = './js/public/editor-elm.js';
modConcat('./editor/editor.js', outputFile, function(err, stats) {
    if (err) {
        process.exit(1);
    }
    console.log(stats.files.length + ' were combined into ' + outputFile);
    process.exit(0);
});
