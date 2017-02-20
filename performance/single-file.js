var loadingPorts = require('../js/util/file-loading-ports');
const Elm = require('./generated/SingleFileRead');
var app = Elm.SingleFileRead.worker('src/Test.elm');

loadingPorts(app, {}, process.cwd());
