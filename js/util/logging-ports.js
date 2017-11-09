module.exports = function(app, config) {
    if (config.format === 'human') {
        app.ports.log.subscribe(data => {
            console.log(data[0] + ':', data[1]);
        });
    }
};
