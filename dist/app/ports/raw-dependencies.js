"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache = __importStar(require("../util/cache"));
function setup(app) {
    app.ports.storeRawDependency.subscribe(function (x) {
        cache.storeDependencyJson(x[0], x[1], x[2]);
    });
    app.ports.loadRawDependency.subscribe(function (x) {
        var dependency = x[0];
        var version = x[1];
        cache.readDependencyJson(dependency, version, function (err, content) {
            if (err) {
                //TODO
                app.ports.onRawDependency.send([dependency, version, '' + x]);
            }
            else {
                app.ports.onRawDependency.send([
                    dependency,
                    version,
                    content.toString()
                ]);
            }
        });
    });
}
exports.setup = setup;
