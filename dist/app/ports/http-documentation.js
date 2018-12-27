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
    app.ports.loadHttpDocumentation.subscribe(function (pointer) {
        var name = pointer.name, version = pointer.version;
        request.get("http://package.elm-lang.org/packages/" + name + "/" + version + "/docs.json", function (err, _response, body) {
            if (err) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
                return;
            }
            try {
                var parsed = JSON.parse(body);
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: parsed
                });
            }
            catch (e) {
                app.ports.onHttpDocumentation.send({
                    dependency: pointer,
                    json: null
                });
            }
        });
    });
}
exports.setup = setup;
