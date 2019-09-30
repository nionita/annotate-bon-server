const crypto = require('crypto');
const fs = require('fs');

const fileHash = filePath => {
  return new Promise((resolve, reject) => {
    const hash = crypto.createHash('sha256');

    hash.on('readable', () => {
      const data = hash.read();
      if (data) {
        resolve(data.toString('hex'));
      } else {
        reject('Hash: No data');
      }
    });

    const input = fs.createReadStream(filePath);
    input.pipe(hash);
  });
}

module.exports = fileHash;