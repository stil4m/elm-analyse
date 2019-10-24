const fs = require('fs');
const packageVersion = require('./package.json').version;
const contents = fs.readFileSync('./html/index.html').toString();
const newContents = contents.replace(/\{\{VERSION\}\}/g, 'v' + packageVersion);
fs.writeFileSync('dist/public/index.html', newContents);
