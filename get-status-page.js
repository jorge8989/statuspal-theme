const fetch = require('node-fetch');
const fs = require('fs');
const assert = require('assert');

const HOST = process.env.HOST || 'https://statuspal.io';
const SPAGE = process.env.SPAGE;

assert(SPAGE, 'Missing env variable SPAGE');

console.log(`>>> Pulling data for status page \"${SPAGE}\" (${HOST})...\n\n`);

(async () => {
  try {
    const resp = await fetch(`${HOST}/api/v1/status_pages/${SPAGE}`);
    if (resp.status === 200) {
      const data = await resp.json();
      fs.writeFile('./intermediate/data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) error(err);
      });
    } else {
      error(`Error getting status page data: ${resp.status}`);
    }
  } catch (e) {
    error(`Error getting status page data: ${e}`);
  }
})();

const error = (mssg) => {
  console.error(mssg);
  process.exit(1);
}
