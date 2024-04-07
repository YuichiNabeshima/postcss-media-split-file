const postcss = require('postcss')
const { equal } = require('node:assert')
const { test } = require('node:test')
const path = require('path');
const fs = require('fs');

const plugin = require('./index.js')
const cssFile = path.join(__dirname, 'css/top.css');
const cssContent = fs.readFileSync(cssFile, 'utf8');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: cssFile });
  equal(result.css, output)
  equal(result.warnings().length, 0)
}

const afterCss = `
  .text {
    font-size: 2rem;
  }
`;

test('does something', async () => {
  await run(cssContent, afterCss, {
    outDir: './',
    target: [
    {
      key: 'sp',
      value: '@media screen and (max-width: 767px)',
    },
    {
      key: 'pc',
      value: '@media screen and (min-width: 768px)',
    },
  ]});
});
