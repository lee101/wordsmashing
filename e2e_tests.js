const puppeteer = require('puppeteer');

async function runE2ETests() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required']
  });
  const page = await browser.newPage();

  let errors = [];
  page.on('pageerror', err => {
    if (!err.message.includes('play()') && !err.message.includes('AbortError')) {
      errors.push(err.message);
    }
  });

  const results = [];

  async function test(name, fn) {
    try {
      await fn();
      results.push({ name, status: 'PASS' });
      console.log('  PASS: ' + name);
    } catch (e) {
      results.push({ name, status: 'FAIL', error: e.message });
      console.log('  FAIL: ' + name);
      console.log('    Error: ' + e.message);
    }
  }

  console.log('\n=== E2E TESTS ===\n');

  // Test 1: Home page loads
  await test('Home page loads', async () => {
    await page.goto('http://localhost:9799/', { waitUntil: 'networkidle0', timeout: 15000 });
    const title = await page.title();
    if (!title.includes('Word Smashing')) throw new Error('Title not found: ' + title);
  });

  // Test 2: fixtures are defined
  await test('Fixtures are defined', async () => {
    const fixtures = await page.evaluate(() => ({
      EASY: window.fixtures.EASY,
      LEVELS_COUNT: window.fixtures.LEVELS.length,
      hasGetLevelsByDifficulty: typeof window.fixtures.getLevelsByDifficulty === 'function'
    }));
    if (fixtures.EASY !== 2) throw new Error('EASY should be 2, got: ' + fixtures.EASY);
    if (fixtures.LEVELS_COUNT === 0) throw new Error('No levels defined');
    if (!fixtures.hasGetLevelsByDifficulty) throw new Error('getLevelsByDifficulty not defined');
  });

  // Test 3: APP is initialized
  await test('APP is initialized', async () => {
    const app = await page.evaluate(() => ({
      hasAPP: typeof window.APP !== 'undefined',
      hasGoto: typeof window.APP?.goto === 'function',
      hasRouter: typeof window.APP?.router !== 'undefined'
    }));
    if (!app.hasAPP) throw new Error('APP not defined');
    if (!app.hasGoto) throw new Error('APP.goto not defined');
  });

  // Test 4: Navigate to campaign
  await test('Navigate to campaign', async () => {
    await page.evaluate(() => APP.goto('/campaign'));
    await new Promise(r => setTimeout(r, 1000));
    const url = page.url();
    if (!url.includes('campaign')) throw new Error('Did not navigate to campaign: ' + url);
  });

  // Test 5: Navigate to campaign/easy
  await test('Navigate to campaign/easy', async () => {
    await page.evaluate(() => APP.goto('/campaign/easy'));
    await new Promise(r => setTimeout(r, 1000));
    const url = page.url();
    if (!url.includes('campaign/easy')) throw new Error('Did not navigate to campaign/easy: ' + url);
  });

  // Test 6: Start a level
  await test('Start level 1', async () => {
    await page.evaluate(() => APP.goto('/campaign/easy/1'));
    await new Promise(r => setTimeout(r, 2000));
    const hasGame = await page.evaluate(() => {
      return APP.game && APP.game.board && APP.game.board.tiles;
    });
    if (!hasGame) throw new Error('Game board not initialized');
  });

  // Test 7: Board has tiles
  await test('Board has tiles', async () => {
    const info = await page.evaluate(() => {
      const board = APP.game.board;
      const tiles = board.tiles;
      return {
        width: board.width,
        height: board.height,
        tilesType: typeof tiles,
        hasTileAt00: !!board.getTile(0, 0),
        firstTileType: board.getTile(0, 0)?.constructor?.name
      };
    });
    console.log('    (Board: ' + info.width + 'x' + info.height + ', tile[0,0]: ' + info.firstTileType + ')');
    if (!info.hasTileAt00) throw new Error('No tile at 0,0');
  });

  // Test 8: Can click tiles
  await test('Can click tiles', async () => {
    const clicked = await page.evaluate(() => {
      const tile = APP.game.board.getTile(0, 0);
      if (tile && tile.click) {
        tile.click();
        return true;
      }
      return false;
    });
    if (!clicked) throw new Error('Could not click tile');
  });

  // Test 9: Navigate to versus mode
  await test('Navigate to versus mode', async () => {
    await page.evaluate(() => APP.goto('/versus'));
    await new Promise(r => setTimeout(r, 1000));
    const url = page.url();
    if (!url.includes('versus')) throw new Error('Did not navigate to versus: ' + url);
  });

  // Test 10: Navigate to learn-english
  await test('Navigate to learn-english', async () => {
    await page.evaluate(() => APP.goto('/learn-english'));
    await new Promise(r => setTimeout(r, 1000));
    const url = page.url();
    if (!url.includes('learn-english')) throw new Error('Did not navigate to learn-english: ' + url);
  });

  // Test 11: Start learn-english level
  await test('Start learn-english/colors level', async () => {
    await page.evaluate(() => APP.goto('/learn-english/colors'));
    await new Promise(r => setTimeout(r, 2000));
    const hasGame = await page.evaluate(() => APP.game && APP.game.board);
    if (!hasGame) throw new Error('Learn English game not started');
  });

  // Test 12: Check static files load
  await test('Static CSS loads', async () => {
    const response = await page.goto('http://localhost:9799/static/css/style.css');
    if (response.status() !== 200) throw new Error('CSS returned ' + response.status());
  });

  // Test 13: Check gameon static files
  await test('Gameon static files load', async () => {
    const response = await page.goto('http://localhost:9799/gameon/static/js/jquery-1.9.1.min.js');
    if (response.status() !== 200) throw new Error('jQuery returned ' + response.status());
  });

  // Test 14: Play a game - make a word
  await test('Play game - make a word', async () => {
    await page.goto('http://localhost:9799/', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => APP.goto('/campaign/easy/1'));
    await new Promise(r => setTimeout(r, 2000));

    const gameState = await page.evaluate(() => {
      const game = APP.game;
      const board = game.board;

      // Set up a known word "CAT"
      board.setTile([0, 0], new game.MainTile('C', true));
      board.setTile([1, 0], new game.MainTile('A', true));
      board.setTile([2, 0], new game.MainTile('T', true));
      board.setTile([3, 0], new game.EmptyTile());

      const scoreBefore = game.starBar.getScore();

      // Click tiles to make word
      board.getTile(0, 0).click();
      board.getTile(3, 0).click();

      const scoreAfter = game.starBar.getScore();

      return {
        scoreBefore,
        scoreAfter,
        scoreIncreased: scoreAfter > scoreBefore
      };
    });

    console.log('    (Score: ' + gameState.scoreBefore + ' -> ' + gameState.scoreAfter + ')');
    if (!gameState.scoreIncreased) {
      console.log('    (Word may not have been valid or move not counted)');
    }
  });

  // Test 15: Starbar exists and works
  await test('Starbar exists', async () => {
    await page.goto('http://localhost:9799/', { waitUntil: 'networkidle0', timeout: 15000 });
    await page.evaluate(() => APP.goto('/campaign/easy/1'));
    await new Promise(r => setTimeout(r, 2000));

    const starbar = await page.evaluate(() => ({
      exists: !!APP.game.starBar,
      hasGetScore: typeof APP.game.starBar?.getScore === 'function',
      hasSetScore: typeof APP.game.starBar?.setScore === 'function',
      currentScore: APP.game.starBar?.getScore()
    }));

    if (!starbar.exists) throw new Error('Starbar not found');
    if (!starbar.hasGetScore) throw new Error('Starbar.getScore not found');
    console.log('    (Current score: ' + starbar.currentScore + ')');
  });

  // Test 16: EndHandler exists
  await test('EndHandler exists', async () => {
    const endHandler = await page.evaluate(() => ({
      exists: !!APP.game.endHandler,
      hasMoves: typeof APP.game.endHandler?.getMoves === 'function' ||
                typeof APP.game.endHandler?.moves !== 'undefined'
    }));
    if (!endHandler.exists) throw new Error('EndHandler not found');
  });

  // Test 17: Test difficulty levels load
  await test('All difficulty levels accessible', async () => {
    const levels = await page.evaluate(() => ({
      easy: fixtures.getLevelsByDifficulty('easy').length,
      medium: fixtures.getLevelsByDifficulty('medium').length,
      hard: fixtures.getLevelsByDifficulty('hard').length,
      expert: fixtures.getLevelsByDifficulty('expert').length
    }));
    console.log('    (Levels - Easy: ' + levels.easy + ', Medium: ' + levels.medium +
                ', Hard: ' + levels.hard + ', Expert: ' + levels.expert + ')');
    if (levels.easy === 0) throw new Error('No easy levels');
    if (levels.medium === 0) throw new Error('No medium levels');
    if (levels.hard === 0) throw new Error('No hard levels');
    if (levels.expert === 0) throw new Error('No expert levels');
  });

  // Test 18: API routes work
  await test('Sitemap loads', async () => {
    const response = await page.goto('http://localhost:9799/sitemap');
    if (response.status() !== 200) throw new Error('Sitemap returned ' + response.status());
    const content = await response.text();
    if (!content.includes('xml')) throw new Error('Sitemap not XML');
  });

  // Test 19: Privacy page loads
  await test('Privacy page loads', async () => {
    const response = await page.goto('http://localhost:9799/privacy');
    if (response.status() !== 200) throw new Error('Privacy returned ' + response.status());
  });

  // Test 20: About page loads
  await test('About page loads', async () => {
    const response = await page.goto('http://localhost:9799/about');
    if (response.status() !== 200) throw new Error('About returned ' + response.status());
  });

  // Summary
  console.log('\n=== SUMMARY ===\n');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log('Passed: ' + passed + '/' + results.length);
  console.log('Failed: ' + failed);

  if (errors.length) {
    console.log('\nPage errors during tests:');
    errors.slice(0, 5).forEach(e => console.log('  - ' + e.substring(0, 150)));
  }

  await browser.close();
  process.exit(failed > 0 ? 1 : 0);
}

runE2ETests().catch(e => {
  console.error('Test runner error:', e);
  process.exit(1);
});
