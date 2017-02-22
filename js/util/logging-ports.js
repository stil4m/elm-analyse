module.exports = function(app, config, directory) {

    app.ports.log.subscribe(data => {
        console.log(data[0] + ":", data[1]);
    })
}
