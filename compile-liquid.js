var path = require("path");
var fs = require('fs');
const fetch = require('node-fetch');
var Liquid = require('liquidjs');

var engine = Liquid({
    root: path.resolve(__dirname, 'src/templates/status_page'),
    extname: '.liquid'
});

fetch('http://localhost:4000/api/v1/status_pages/meta')
  .then(res => res.json())
  .then((json) => {
    engine.renderFile('index.liquid', json).then((content) => {
      fs.writeFile(path.resolve(__dirname, 'intermediate/index.html'), content, (error) => {
        if (error) console.error(`Failed to save file: ${error}`);
      });
    }).catch((e) => {
      console.error(`Failed to compile liquid:\n${e}\n${e.stack}`);
    });
  });
