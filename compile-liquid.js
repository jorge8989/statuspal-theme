const path   = require("path");
const fs     = require('fs');
const fetch  = require('node-fetch');
const Liquid = require('liquidjs');

const packageObj = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'package.json'), 'utf8'));

function compileTemplate(template) {
  const data = JSON.parse(fs.readFileSync(`./intermediate/${template}.json`));
  data.template = `${template}/${template}`;

  engine.renderFile('layout.liquid', data)
    .then((content) => {
      fs.writeFileSync(path.resolve(__dirname, `intermediate/${template}.html`), content);
    })
    .catch((e) => {
      console.error(`Failed to compile liquid:\n${e}\n${e.stack}`);
    });
}

const engine = Liquid({
    root: path.resolve(__dirname, 'src/templates'),
    extname: '.liquid'
});

engine.registerTag('assets_url', {
  parse: function (tagToken, remainTokens) {
    this.str = tagToken.args;
  },
  render: function (scope, hash) {
    return Promise.resolve(Liquid.evalValue(this.str, scope));
  }
});

engine.registerTag('theme_color', {
  parse: function (tagToken, remainTokens) {
    this.str = tagToken.args;
  },
  render: function (scope, hash) {
    const colorName = Liquid.evalValue(this.str, scope);
    return Promise.resolve(`#${packageObj.theme.defaults[colorName]}`);
  }
});

engine.registerTag('t', {
  parse: function (tagToken, remainTokens) {
    this.str = tagToken.args;
  },
  render: function (scope, hash) {
    const localization_key = Liquid.evalValue(this.str, scope);
    const localization = Liquid.evalValue(`localization.${localization_key}`, scope);
    var tpl = engine.parse(localization);
    return engine.render(tpl, scope.contexts[0]);
  }
});

engine.registerFilter('url', (str) => {
  const pieces = str.split(`status_pages/${process.env.SPAGE}`);
  const url = pieces.length > 1 ? pieces[1] : str;
  return url.length === 0 ? '/' : url;
});

['status_page', 'incidents', 'incident'].forEach(t => compileTemplate(t));
