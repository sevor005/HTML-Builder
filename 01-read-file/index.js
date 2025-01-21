const fs = require('fs');
const path = require('path');

const readStream = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf8');

readStream.pipe(process.stdout);

readStream.on('error', (error) => {
    console.log(error);
});
