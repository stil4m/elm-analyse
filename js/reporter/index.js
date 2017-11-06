module.exports = function(reporter, report) {
    if (reporter == "json") {
        require("./json-reporter")(report);
    } else {
        require("./human-reporter")(report);
    }
};
