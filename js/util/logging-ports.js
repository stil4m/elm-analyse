module.exports = function(app, config, _directory) {
    if (config.format === "human") {
        app.ports.log.subscribe(data => {
            console.log(data[0] + ":", data[1]);
        });
    }
};
