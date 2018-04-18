const puppeteer = require('puppeteer');
const { test } = require('tap');


async function runTests(server) {

  await test('The map is loaded', async (t) => {
    const browser = await puppeteer.launch({
      //uncomment to launch graphical browser
      //headless: false,
      //slowMo: 500,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto('http://localhost:8123/index.html');

    //div is present
    const div = await page.$eval('#mapdiv', el => Boolean(el));
    await t.assert(div === true, 'div is present');

    //test that click handler populates el with x,y
    await page.mouse.click(100,100);
    const xy = await page.$eval('#clickresults', el => el.innerText);
    await t.assert(xy == '100,100', 'click happened where we expected it');

    //add three point objects to vector layer
    await page.mouse.click(200,400);
    await page.mouse.click(300,400);
    await page.mouse.click(250,500);
    await page.waitFor(200);

    //get layer list and number of features
    const lyrs = await page.evaluate(() => {
      let layers = map2.getLayers().getArray();
      let vectorlayer = layers[1];
      let features = vectorlayer.getSource().getFeatures();

      return {
        layerCount: layers.length,
        featureCount: features.length
      }
    });

    //test layer list and number of features
    await t.assert(lyrs.layerCount === 2, 'there are two layers on the map');
    await t.assert(lyrs.featureCount === 3, 'there are three point features in the vector layer');
    await browser.close();
    t.end();
  });
  server.close();
}

module.exports = runTests;
