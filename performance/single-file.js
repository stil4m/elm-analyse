const loadingPorts = require('../js/util/file-loading-ports');
const fs = require('fs');
const Elm = require('./generated/SingleFileRead');
const app = Elm.SingleFileRead.worker();
const counter = 20;

var paths = require('find').fileSync(/\.elm$/, 'src');
var content, currentFile;

var results = [];
var table = {}
var before;

function storeResult() {
    table[currentFile] = results;
    results = [];
}

function sendNext() {
    before = new Date().getTime()
    app.ports.newInput.send(content);
};

function printResults() {
    triples = Object.keys(table).map(function(k) {
        var list = table[k];
        list.sort((b, a) => b - a);
        var step = list.length / 10;
        const part = list.slice(step, step * 9);
        const average = part.reduce((x, y) => x + y, 0) / part.length;
        return [k, average, list];
    });

    triples.sort((a, b) => b[1] - a[1]);

    // var step =  (counter/10);
    // const part = results.slice (step, step * 9);
    // const average = part.reduce((x, y) => x + y, 0) / part.length;
    // results.sort((b,a) => b - a);
    // console.log(results);
    // console.log(average);
    triples.forEach(x => {
        console.log(x[1], x[0]);
    })
}

function triggerNextFile() {
    const next = paths.shift();
    if (!next) {
        printResults();
        return;
    }
    console.log('Next file:', next);
    currentFile = next;
    content = fs.readFileSync(next).toString();
    sendNext();
}
app.ports.parsed.subscribe(function(_) {
    var after = new Date().getTime();
    console.log("Tick");
    results.push(after - before);
    if (results.length >= counter) {
        storeResult();
        triggerNextFile();
        return;
    }
    sendNext();
});

triggerNextFile();
