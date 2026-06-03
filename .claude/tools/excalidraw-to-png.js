#!/usr/bin/env node
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const input = process.argv[2];
  if (!input) {
    console.error('Usage: excalidraw-to-png.js <input.excalidraw> [output.png] [scale=2]');
    process.exit(1);
  }
  const output = process.argv[3] || input.replace(/\.excalidraw$/, '.png');
  const scale = Number(process.argv[4] || 2);
  const data = JSON.parse(fs.readFileSync(input, 'utf8'));

  const utilsPath = path.resolve(__dirname, 'node_modules/@excalidraw/utils/dist/prod/index.js');
  const utilsUrl = 'file://' + utilsPath;

  const html = `<!DOCTYPE html><html><head>
<meta charset="utf-8">
<style>body{margin:0;font-family:Virgil,'Apple SD Gothic Neo','Cascadia',sans-serif;}</style>
</head><body><div id="root"></div>
<script type="module">
  import * as U from ${JSON.stringify(utilsUrl)};
  window.ExcalidrawUtils = U;
  window.__READY__ = true;
</script>
</body></html>`;

  const htmlPath = path.join(__dirname, '.render.html');
  fs.writeFileSync(htmlPath, html);

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--allow-file-access-from-files', '--disable-web-security'],
  });
  const page = await browser.newPage();
  page.on('pageerror', e => console.error('[pageerror]', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('[console]', m.text()); });

  await page.goto('file://' + htmlPath, { waitUntil: 'load' });
  await page.waitForFunction('window.__READY__ === true', { timeout: 30000 });

  const dataUrl = await page.evaluate(async (data, scale) => {
    const blob = await window.ExcalidrawUtils.exportToBlob({
      elements: data.elements,
      appState: {
        ...(data.appState || {}),
        exportBackground: true,
        viewBackgroundColor: (data.appState && data.appState.viewBackgroundColor) || '#ffffff',
        exportWithDarkMode: false,
      },
      files: data.files || {},
      mimeType: 'image/png',
      getDimensions: (w, h) => ({ width: w * scale, height: h * scale, scale }),
    });
    return await new Promise((resolve) => {
      const r = new FileReader();
      r.onloadend = () => resolve(r.result);
      r.readAsDataURL(blob);
    });
  }, data, scale);

  const base64 = dataUrl.split(',')[1];
  fs.writeFileSync(output, Buffer.from(base64, 'base64'));
  await browser.close();
  console.log(output);
})().catch(e => { console.error(e.message); process.exit(3); });
