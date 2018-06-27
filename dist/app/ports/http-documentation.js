"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var request = __importStar(require("request"));
function setup(app) {
    //TODO
    app.ports.loadHttpDocumentation.subscribe(function (depPair) {
        var name = depPair[0];
        var version = depPair[1];
        request.get("http://package.elm-lang.org/packages/" + name + "/" + version + "/documentation.json", function (err, _response, body) {
            if (err) {
                app.ports.onHttpDocumentation.send([depPair, null]);
                return;
            }
            try {
                var parsed = JSON.parse(body);
                app.ports.onHttpDocumentation.send([depPair, parsed]);
            }
            catch (e) {
                app.ports.onHttpDocumentation.send([depPair, null]);
            }
        });
    });
}
exports.setup = setup;
