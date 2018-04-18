Example tests of openlayers application with puppeteer and tap
==============================================================

    npm run test
    npm run watch-test


`serve/serve.js` starts a web server and calls `test/test.js`, which loads `test/test.html` from the web server and runs asynchronous tests against it using puppeteer.

Puppeteer has an extensive API for controlling interactions with the web page.
