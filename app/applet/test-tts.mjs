import https from 'https';
https.get('https://translate.google.com/translate_tts?ie=UTF-8&q=hello&tl=en&client=tw-ob', (res) => {
  console.log(res.statusCode);
});
