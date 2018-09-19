const path   = require("path");
const fs     = require('fs');
const fetch  = require('node-fetch');
const Liquid = require('liquidjs');

const engine = Liquid({
    root: path.resolve(__dirname, 'src/templates/status_page'),
    extname: '.liquid'
});
engine.registerFilter('assets_url', str => str)

const data = JSON.parse(fs.readFileSync('./intermediate/data.json'));

engine.renderFile('index.liquid', data)
  .then((content) => {
    fs.writeFileSync(path.resolve(__dirname, 'intermediate/index.html'), content);
  })
  .catch((e) => {
    console.error(`Failed to compile liquid:\n${e}\n${e.stack}`);
  });
1
