module.exports = function(app, _config, _directory) {

    app.ports.log.subscribe(data => {
        console.log(data[0] + ':', data[1]);
    });
};
