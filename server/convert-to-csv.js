'use strict';
const fs = require('fs');

class convert {

  static writeToFile(fileName,data) {
    const stream = fs.createWriteStream(fileName);
    stream.once('open', () => {
      stream.write('Link, Text\n');
      data.forEach(row => stream.write(`${row.link}, ${row.text}\n`));
      stream.end();
    });
  }

}

module.exports = convert;
