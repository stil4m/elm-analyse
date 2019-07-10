import _ from 'lodash';
import { Report, Reporter, Message } from '../domain';

function report(report: Report) {
    const messages = report.messages;
    const unusedDependencies = report.unusedDependencies;

    console.log('Found ' + report.messages.length + ' message(s)');
    if (messages.length > 0) {
        const index: _.Dictionary<Message[]> = _.groupBy(messages, 'file');
        console.log();
        console.log('Messages:');
        Object.keys(index).forEach(file => {
            console.log('- ' + file);
            index[file].forEach((x: Message) => {
                console.log('  > ' + x.data.description);
            });
        });
    }
    if (unusedDependencies.length > 0) {
        console.log();
        console.log('Unused dependencies:');
        unusedDependencies.forEach(dep => console.log('- ' + dep));
    }
}

const reporter: Reporter = { report };
export default reporter;
