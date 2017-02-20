var loadingPorts = require('../js/util/file-loading-ports');
const Elm = require('./generated/SingleFileRead');
var app = Elm.SingleFileRead.worker('src/AST/Decoding.elm');

loadingPorts(app, {}, process.cwd());
