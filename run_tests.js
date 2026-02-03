const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
  const page = await browser.newPage();

  let consoleErrors = [];
  page.on('pageerror', err => consoleErrors.push(err.message));
  page.on('console', msg => {
    if (msg.type() === 'error' && !msg.text().includes('play()')) {
      consoleErrors.push(msg.text());
    }
  });

  await page.goto('http://localhost:9799/tests', { waitUntil: 'load', timeout: 15000 });

  // Wait for document ready and game init
  await new Promise(r => setTimeout(r, 3000));

  const result = await page.evaluate(() => {
    return new Promise((resolve) => {
      const env = jasmine.getEnv();
      let results = { specs: [], failures: [] };

      env.addReporter({
        specDone: function(result) {
          results.specs.push({ name: result.fullName, status: result.status });
          if (result.status === 'failed') {
            results.failures.push({
              name: result.fullName,
              messages: result.failedExpectations.map(e => e.message)
            });
          }
        },
        jasmineDone: function() {
          resolve(results);
        }
      });

      env.execute();

      setTimeout(() => resolve(results), 20000);
    });
  });

  console.log('\n=== JASMINE TEST RESULTS ===\n');
  console.log('SPECS: ' + result.specs.length);
  result.specs.forEach(s => console.log('  ' + (s.status === 'passed' ? 'PASS' : 'FAIL') + ': ' + s.name));

  if (result.failures.length) {
    console.log('\nFAILURES:');
    result.failures.forEach(f => {
      console.log('  ' + f.name);
      f.messages.forEach(m => console.log('    - ' + m));
    });
  }

  if (consoleErrors.length) {
    console.log('\nCONSOLE ERRORS:');
    consoleErrors.slice(0, 10).forEach(e => console.log('  - ' + e.substring(0, 200)));
  }

  const passed = result.specs.filter(s => s.status === 'passed').length;
  const failed = result.specs.filter(s => s.status === 'failed').length;
  console.log('\nSUMMARY: ' + passed + ' passed, ' + failed + ' failed\n');

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
})();
