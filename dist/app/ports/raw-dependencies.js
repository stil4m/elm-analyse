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
        var dependency = x.dependency;
        cache.storeDependencyJson(dependency.name, dependency.version, x.content);
    });
    app.ports.loadRawDependency.subscribe(function (dependency) {
        cache.readDependencyJson(dependency.name, dependency.version, function (err, content) {
            if (err) {
                app.ports.onRawDependency.send({
                    dependency: dependency,
                    json: null
                });
            }
            else {
                try {
                    var parsed = JSON.parse(content.toString());
                    app.ports.onRawDependency.send({
                        dependency: dependency,
                        json: parsed
                    });
                }
                catch (e) {
                    app.ports.onRawDependency.send({
                        dependency: dependency,
                        json: null
                    });
                }
            }
        });
    });
}
exports.setup = setup;
