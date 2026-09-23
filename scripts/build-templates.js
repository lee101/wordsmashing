const fs = require('fs');
const path = require('path');
const nunjucks = require('nunjucks');

const ROOT = path.join(__dirname, '..');
const DIR = 'templates/shared';
const SKIP = new Set(['about.jinja2', 'terms.jinja2', 'privacy.jinja2']);

const out = fs.readdirSync(path.join(ROOT, DIR))
  .filter(f => f.endsWith('.jinja2') && !SKIP.has(f))
  .sort()
  .map(f => {
    const name = `${DIR}/${f}`;
    return nunjucks.precompileString(fs.readFileSync(path.join(ROOT, name), 'utf8'), { name });
  })
  .join('\n');

fs.writeFileSync(path.join(ROOT, 'static/js/templates.js'), out);
console.log(`static/js/templates.js ${out.length} bytes`);
