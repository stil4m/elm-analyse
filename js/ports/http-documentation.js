const request = require('request');

module.exports = function setup(app) {
    const checkedSubscribe = require('./checked-subscribe')(app);

    checkedSubscribe('loadHttpDocumentation', function(depPair) {
        const name = depPair[0];
        const version = depPair[1];

        request(
            `http://package.elm-lang.org/packages/${name}/${version}/documentation.json`,
            function(err, response, body) {
                if (err) {
                    app.ports.onHttpDocumentation.send([depPair, null]);
                    return;
                }
                try {
                    const parsed = JSON.parse(body);
                    app.ports.onHttpDocumentation.send([depPair, parsed]);
                } catch (e) {
                    app.ports.onHttpDocumentation.send([depPair, null]);
                }
            }
        );
    });
};
