const https = require('https');

https.get('https://js.puter.com/v2/', (res) => {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    const index = data.indexOf('txt2img');
    console.log(data.slice(index, index + 2000));
  });
});
