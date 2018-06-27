import { Report, Reporter } from '../domain';

function report(report: Report) {
    const output = JSON.stringify(report);
    console.log(output);
}

const reporter: Reporter = { report };
export default reporter;
