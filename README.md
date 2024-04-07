# postcss-media-split-file

PostCSS plugin to split files by specific media query.

```css
/* style.css */
.title {
  font-weight: 700;

  @media screen and (768px <= width) {
    font-size: 2.4rem;
  }
  @media screen and (width < 768px) {
    font-size: 2rem;
  }
}

.text {
  font-weight: 400;

  @media screen and (768px <= width) {
    font-size: 1.6rem;
  }
  @media screen and (width < 768px) {
    font-size: 1.4rem;
  }
}
```
Create files.

```css
/* style_pc.css */
.title {
  font-weight: 700;
    font-size: 2.4rem;
}

.text {
  font-weight: 400;
    font-size: 1.6rem;
}
```

```css
/* style_sp.css */
.title {
  font-weight: 700;
    font-size: 2rem;
}

.text {
  font-weight: 400;
    font-size: 1.4rem;
}
```

## Installation
```shell
npm i postcss-media-split-file
```

## Usage
```js
const fs = require("fs");
const postcss = require("postcss");
const plugin = require("postcss-media-split-file");
const cssFile = path.join(__dirname, 'style.css');
const cssContent = fs.readFileSync(cssFile, 'utf8');

const opts = {
  outDir: './',
  target: [
    {
      key: 'pc',
      value: '@media screen and (768px <= width)',
    },
    {
      key: 'sp',
      value: '@media screen and (width < 768px)',
    },
  ],
};

postcss([ plugin(opts) ]).process(cssContent, { from: cssFile });
```
