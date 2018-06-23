module.exports = function(app, config, directory) {
    require('./ports/http-documentation')(app);
    require('./ports/raw-dependencies')(app);
    require('./ports/dependency-files')(app, config, directory);
    require('./ports/file-loader')(app, config, directory);
    require('./ports/context')(app, directory);
};
