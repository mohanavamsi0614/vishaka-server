const axios = require('axios');
const fs = require('fs');

axios.get(
  'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent('http://localhost:5000/68b425d00aaf0bb54a2d7464') + '&size=200x200',
  { responseType: 'stream' }
).then(response => {
  // Write response data (as a stream) directly to a file
  response.data.pipe(fs.createWriteStream('qrcode.png'));

  response.data.on('end', () => {
    console.log('QR Code image saved as qrcode.png');
  });
  response.data.on('error', err => {
    console.error('Error writing QR Code image:', err);
  });
}).catch(error => {
  console.error('Error generating QR code:', error);
});
