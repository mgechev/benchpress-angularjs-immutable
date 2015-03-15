/* global afterEach, beforeEach, browser */
var httpServer = require('http-server');

exports.config = {
  directConnect: true,

  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      //Important for benchpress to get timeline data from the browser
      args: ['--js-flags=--expose-gc'],
      perfLoggingPrefs: {
        traceCategories: 'blink.console,disabled-by-default-devtools.timeline'
      }
    },
    loggingPrefs: {
      performance: 'ALL'
    }
  },

  specs: ['./benchmarks/**/*'],
  framework: 'jasmine2',

  beforeLaunch: function () {
    'use strict';
    httpServer.createServer({
      showDir: true
    }).listen('8080', 'localhost');
  },

  onPrepare: function () {
    'use strict';
    // open a new browser for every benchmark
    var originalBrowser = browser;
    beforeEach(function () {
      global.browser = originalBrowser.forkNewDriverInstance();
      global.element = global.browser.element;
      global.$ = global.browser.$;
      global.$$ = global.browser.$$;
    });
    afterEach(function () {
      global.browser.quit();
      global.browser = originalBrowser;
    });
  },

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 60000
  },
};
