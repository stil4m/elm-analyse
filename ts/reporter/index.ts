import { Reporter } from '../domain';
import HumanReporter from './human-reporter';
import JsonReporter from './json-reporter';

function build(reporter: string | undefined): Reporter {
    let rep: Reporter;
    if (reporter === 'json') {
        rep = JsonReporter;
    } else {
        rep = HumanReporter;
    }

    return rep;
}

export default { build };
