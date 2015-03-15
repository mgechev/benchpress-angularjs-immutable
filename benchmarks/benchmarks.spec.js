/* global browser, it, describe, beforeEach */
describe('Immutable data structure', function () {
  'use strict';

  var runner;
  var benchpress;

  function benchmark(dataSize, bindingsCount, done) {
    //Tells protractor this isn't an Angular 1 application
    browser.ignoreSynchronization = true;
    //Load the benchmark, with a tree depth of 9
    browser
    .get('http://localhost:8080/#/?bindingsCount=' +
      bindingsCount + '&dataSize=' + dataSize);
    /*
     * Tell benchpress to click the buttons to destroy and
     * re-create the tree for each sample.
     * Benchpress will log the collected metrics after each
     * sample is collected, and will stop
     * sampling as soon as the calculated regression slope
     * for last 20 samples is stable.
     */
    runner.sample({
      id: 'immutable-test',
      execute: function () {
        /*
         * Will call querySelector in the browser, but
         * benchpress is smart enough to ignore injected
         * script.
         */
        $('#immutable-btn').click();
        $('#clear-btn').click();
      }
    }).then(function (res) {
      console.log('hereee', res.validSample);
      done();
    }, done.fail);
  }

  beforeEach(function () {
    benchpress = require('benchpress');
    runner = new benchpress.Runner([
      benchpress.MultiReporter.createBindings([
        benchpress.ConsoleReporter,
        benchpress.JsonFileReporter
      ]),
      benchpress.JsonFileReporter.BINDINGS,
      benchpress.bind(benchpress.JsonFileReporter.PATH).toValue('./log/'),
      //use protractor as Webdriver client
      benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS,
      //use RegressionSlopeValidator to validate samples
      benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
      //use 20 samples to calculate slope regression
      benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE)
        .toValue(20),
//      //use the script metric to calculate slope regression
//      benchpress.bind(benchpress.RegressionSlopeValidator.METRIC)
//        .toValue('script'),
      benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
    ]);
  });

  var dataSizes = [5, 10, 20, 50];//, 100, 500, 1000, 2000, 5000, 10000, 100000];
  var bindingsCount = [5, 10, 20, 40, 50];

  var product = [];
  for (var s = 0; s < dataSizes.length; s += 1) {
    for (var c = 0; c < bindingsCount.length; c += 1) {
      product.push({
        dataSize: dataSizes[s],
        bindingsCount: bindingsCount[c]
      });
    }
  }

  product.forEach(function (b) {
    it('runs with ' + b.dataSize + ' data size, ' +
      b.bindingsCount + ' bindings',
      function (done) {
        benchmark(b.dataSize, b.bindingsCount, done);
      });
  });
});
