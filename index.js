const fs   = require('fs')
const path = require('path');

/**
 * @param {AtRule_} atRule
 * @param {string} key
 * @param {{key: string, value: string}[]} otherKeys
 */
const updateCss = (atRule, key, otherKeys) => {
  if ( otherKeys.some(otherKey => otherKey.value.includes(atRule.params)) ) {
    atRule.remove();
    return;
  }

  if (key.includes(atRule.params)) {
    atRule.walk(child => {
      if (child.parent === atRule) {
        atRule.before(child);
      }
      if (child.type === 'atrule') {
        updateCss(child, key, otherKeys);
      }
    });
    atRule.remove();
  }
};

/**
 * @type {import('postcss').PluginCreator}
 * @param { {target: {key: string, value: string}[]} } opts
 */
const plugin = (opts = {}) => {
  return {
    postcssPlugin: 'postcss-media-split-file',
    Once( root, { result } ) {
      opts.target.forEach(target => {
        if (!root.source.input.css.includes(target.value)) return;

        const cloneRoot = root.clone();
        const deleteKeys = opts.target.filter(obj => obj.key !== target.key);

        cloneRoot.walkAtRules('media', atRule => {
          updateCss(atRule, target.value, deleteKeys);
        });

        const newFile = cloneRoot.toResult().css;
        const cssFileName = result.opts.from;

        const dirname = opts.outDir || path.dirname(cssFileName);
        const filename = path.basename(cssFileName, path.extname(cssFileName));

        fs.writeFileSync(`${dirname}/${filename}_${target.key}.css`, newFile);
      });
    },
  }
}

module.exports.postcss = true
module.exports = plugin;
