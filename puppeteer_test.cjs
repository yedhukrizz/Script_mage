const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.toString()));
  
  await page.goto('http://127.0.0.1:3000');
  
  await page.evaluate(async () => {
    console.log('Fetching audio...');
    try {
      const url = '/api/tts?text=hello&lang=en&voice=Brian';
      console.log('Testing direct Audio playback...');
      const audio = new Audio(url);
      audio.oncanplay = () => console.log('canplay direct');
      audio.onerror = (e) => console.log('error direct code:', audio.error ? audio.error.code : 'unknown', 'message:', audio.error ? audio.error.message : 'none');
      
      console.log('Testing fetch+blob...');
      const res = await fetch(url);
      console.log('fetch res status:', res.status, res.headers.get('content-type'));
      const blob = await res.blob();
      console.log('blob size:', blob.size, 'type:', blob.type);
      const blobUrl = URL.createObjectURL(blob);
      const audio2 = new Audio(blobUrl);
      audio2.oncanplay = () => console.log('canplay blob');
      audio2.onerror = (e) => console.log('error blob code:', audio2.error ? audio2.error.code : 'unknown', 'message:', audio2.error ? audio2.error.message : 'none');
    } catch(e) {
      console.log('Exception in browser', e.message);
    }
  });
  
  await new Promise(r => setTimeout(r, 2000));
  await browser.close();
})();
