/* global browser */

function createRunner(config) {
  'use strict';
  var benchpress = require('benchpress');
  return new benchpress.Runner([
    benchpress.MultiReporter.createBindings([
      benchpress.ConsoleReporter,
      benchpress.JsonFileReporter
    ]),
    benchpress.JsonFileReporter.BINDINGS,
    benchpress.bind(benchpress.JsonFileReporter.PATH)
      .toValue(config.log),
    //use protractor as Webdriver client
    benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS,
    //use RegressionSlopeValidator to validate samples
    benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
    benchpress.bind(benchpress.Options.SAMPLE_DESCRIPTION)
      .toValue(config.params),
    //use 20 samples to calculate slope regression
    benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE)
      .toValue(20),
    benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
  ]);
}

/**
 * config:
 *  - id
 *  - params
 *  - description
 *  - url
 *  - buttons
 *  - log
 */
function runBenchmark(config, done) {
  'use strict';
  var params = config.params;
  var queryString = [];
  for (var param in params) {
    queryString.push(param + '=' + params[param]);
  }
  browser.get(config.url + '/#/?' + queryString.join('&'));
  var runner = createRunner(config);
  runner.sample({
    id: config.id,
    execute: function () {
      config.buttons.forEach(function (button) {
        $(button).click();
      });
    }
  }).then(done, done.fail);
}

exports.runBenchmark = runBenchmark;
