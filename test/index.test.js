const postcss   = require('postcss')
const assert = require('node:assert')
const { test }  = require('node:test')
const path      = require('path');
const fs        = require('fs');

const plugin     = require('../index.js')
const cssFile    = path.join(__dirname, 'style.css');
const cssContent = fs.readFileSync(cssFile, 'utf8');
const pcExpectCssFile  = path.join(__dirname, 'expect/style_pc.css');
const pcExpectCssContent = fs.readFileSync(pcExpectCssFile, 'utf8');
const spExpectCssFile  = path.join(__dirname, 'expect/style_sp.css');
const spExpectCssContent = fs.readFileSync(spExpectCssFile, 'utf8');

async function run(input, output, opts = {}) {
  let result = await postcss([plugin(opts)]).process(input, { from: cssFile });
  assert.equal(result.css, output)
  assert.equal(result.warnings().length, 0)
}

test('style equal', async () => {
  await run(cssContent, cssContent, {
    outDir: './test/dist',
    target: [
    {
      key: 'pc',
      value: '@media screen and (768px <= width)',
    },
    {
      key: 'sp',
      value: '@media screen and (width < 768px)',
    },
  ]});
});

test('pc ver exist', async () => {
  const result = fs.existsSync('./test/dist/style_pc.css');
  assert.ok(result)
});

test('sp ver exist', async () => {
  const result = fs.existsSync('./test/dist/style_sp.css');
  assert.ok(result)
});

test('pc file equal', async () => {
  const pcCssFile = path.join(__dirname, './dist/style_pc.css');
  const pcCssContent = fs.readFileSync(pcCssFile, 'utf8');
  assert.equal(pcCssContent, pcExpectCssContent);
});

test('sp file equal', async () => {
  const spCssFile = path.join(__dirname, './dist/style_sp.css');
  const spCssContent = fs.readFileSync(spCssFile, 'utf8');
  assert.equal(spCssContent, spExpectCssContent);
});
