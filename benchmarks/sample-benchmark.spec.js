/* global browser, it, describe, beforeEach */
describe('Immutable data structure', function () {
  'use strict';

  var runner;
  var benchpress;

  beforeEach(function () {
    benchpress = require('benchpress');
    runner = new benchpress.Runner([
      //use protractor as Webdriver client
      benchpress.SeleniumWebDriverAdapter.PROTRACTOR_BINDINGS,
      //use RegressionSlopeValidator to validate samples
      benchpress.Validator.bindTo(benchpress.RegressionSlopeValidator),
      //use 5 samples to calculate slope regression
      benchpress.bind(benchpress.RegressionSlopeValidator.SAMPLE_SIZE)
        .toValue(5),
//      //use the script metric to calculate slope regression
//      benchpress.bind(benchpress.RegressionSlopeValidator.METRIC)
//        .toValue('script'),
      benchpress.bind(benchpress.Options.FORCE_GC).toValue(true)
    ]);
  });

  it('should be fast!', function (done) {
    var bindingsCount = 10;
    var dataSize = 10000;
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
    }).then(done, done.fail);
  });
});
