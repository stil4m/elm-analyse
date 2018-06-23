module.exports = function(app) {
    return function checkedSubscribe(key, f) {
        if (app.ports[key]) {
            app.ports[key].subscribe(f);
        } else {
            console.log('WARN: Port ', key, ' is not defined');
        }
    };
};
