"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = void 0;
function setup(app, config) {
    if (config.format === 'human') {
        app.ports.log.subscribe(function (data) {
            console.log(data.level + ':', data.message);
        });
    }
}
exports.setup = setup;
