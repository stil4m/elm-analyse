const loadingPorts = require('../js/util/file-loading-ports');
const fs = require('fs');
const path = process.argv[2];
const content = fs.readFileSync(path).toString();
const Elm = require('./generated/SingleFileRead');
const app = Elm.SingleFileRead.worker();
const counter = 100;

var results = [];
var before;

function sendNext( ) {
  before = new Date().getTime()
  app.ports.newInput.send(content);
};

app.ports.parsed.subscribe(function(_) {
  var after = new Date().getTime();
  console.log("Tick");
  results.push(after-before);
  if (results.length >= counter) {
    const average = results.reduce((x, y) => x + y, 0) / counter;
    console.log(results);
    console.log(average);
    return;
  }
  sendNext();
});

sendNext();
