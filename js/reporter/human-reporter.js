const _ = require('lodash');
module.exports = report => {
    const messages = report.messages;
    const unusedDependencies = report.unusedDependencies;
    if (messages.length > 0) {
        const index = _.groupBy(messages, 'file');
        console.log();
        console.log('Messages:');
        Object.keys(index).forEach(file => {
            console.log('- ' + file);
            index[file].forEach(x => {
                console.log('  > ' + x.data.description);
            });
        });
    }
    if (unusedDependencies.length > 0) {
        console.log();
        console.log('Unused dependencies:');
        unusedDependencies.forEach(dep => console.log('- ' + dep));
    }
};
