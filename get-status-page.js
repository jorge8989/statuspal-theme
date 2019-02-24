const fetch = require('node-fetch');
const fs = require('fs');
const assert = require('assert');

const HOST = process.env.HOST || 'https://statuspal.io';
const SPAGE = process.env.SPAGE;
const LANG = process.env.LANG;

const LANG_QUERY = LANG ? `lang=${LANG}&` : '';

assert(SPAGE, 'Missing env variable SPAGE');

console.log(`>>> Pulling data for status page \"${SPAGE}\" (${HOST})...\n\n`);

async function getData(path, jsonFileName) {
  try {
    const resp = await fetch(`${HOST}/api/v1/${path}?${LANG_QUERY}`);
    if (resp.status === 200) {
      const data = await resp.json();
      fs.writeFile(`./intermediate/${jsonFileName}`, JSON.stringify(data, null, 2), (err) => {
        if (err) error(err);
      });
      return data;
    } else {
      error(`Error getting data: ${resp.status}`);
    }
  } catch (e) {
    error(`Error getting data: ${e}`);
  }
};

(async () => {
  getData(`status_pages/${SPAGE}`, 'status_page.json');
  const data = await getData(`status_pages/${SPAGE}/incidents`, 'incidents.json');
  if (data.incidents[0]) {
    getData(`status_pages/${SPAGE}/incidents/${data.incidents[0].id}`, 'incident.json');
  }
})();

const error = (mssg) => {
  console.error(mssg);
  process.exit(1);
}
