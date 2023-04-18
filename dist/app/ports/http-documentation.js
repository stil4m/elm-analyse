"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
function setup(app) {
    app.ports.loadHttpDocumentation.subscribe(function (pointer) {
        var name = pointer.name, version = pointer.version;
        axios_1.default.get("http://package.elm-lang.org/packages/" + name + "/" + version + "/docs.json")
            .then(function (reponse) {
            app.ports.onHttpDocumentation.send({
                dependency: pointer,
                json: reponse.data
            });
        })
            .catch(function () {
            app.ports.onHttpDocumentation.send({
                dependency: pointer,
                json: null
            });
        });
    });
}
exports.setup = setup;
