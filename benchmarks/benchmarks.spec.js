/* global it */

'use strict';
var runBenchmark = require('./common').runBenchmark;

var dataSizes = /*[5, 10, 20, 50, 100, 500, 1000, 2000,*/ [5000, 10000, 100000];
var bindingsCount = /*[5, 10, 20, 30, 40, 50, 60, 70, 80, */[90, 100];

var PAGE_URL = 'http://localhost:8080';

var benchmarks = [
//  function (bindingsCount, dataSize, done) {
//    runBenchmark({
//      url: PAGE_URL,
//      description: 'should run immutable creation benchmarks',
//      id: 'immutable-' + dataSize + '-' + bindingsCount,
//      buttons: ['#immutable-btn', '#clear-btn'],
//      params: {
//        bindingsCount: bindingsCount,
//        dataSize: dataSize,
//        dataType: 'immutable',
//        testType: 'create',
//      },
//      log: './log'
//    }, done);
//  },
//  function (bindingsCount, dataSize, done) {
//    runBenchmark({
//      url: PAGE_URL,
//      description: 'should run standard creation benchmarks',
//      id: 'standard-' + dataSize + '-' + bindingsCount,
//      buttons: ['#standard-btn', '#clear-btn'],
//      params: {
//        bindingsCount: bindingsCount,
//        dataSize: dataSize,
//        dataType: 'standard',
//        testType: 'create',
//      },
//      log: './log'
//    }, done);
//  },
  function (bindingsCount, dataSize, done) {
    runBenchmark({
      url: PAGE_URL,
      description: 'should run standard update benchmarks',
      id: 'standard-' + dataSize + '-' + bindingsCount,
      buttons: ['#update-standard-btn'],
      params: {
        bindingsCount: bindingsCount,
        dataSize: dataSize,
        dataType: 'standard',
        testType: 'update',
      },
      log: './log'
    }, done);
  },
  function (bindingsCount, dataSize, done) {
    runBenchmark({
      url: PAGE_URL,
      description: 'should run immutable update benchmarks',
      id: 'immutable-' + dataSize + '-' + bindingsCount,
      buttons: ['#update-immutable-btn'],
      params: {
        bindingsCount: bindingsCount,
        dataSize: dataSize,
        dataType: 'immutable',
        testType: 'update',
      },
      log: './log'
    }, done);
  },
  function (bindingsCount, dataSize, done) {
    runBenchmark({
      url: PAGE_URL,
      description: 'should run revisionable update benchmarks',
      id: 'revisionable-' + dataSize + '-' + bindingsCount,
      buttons: ['#update-revisionable-btn'],
      params: {
        bindingsCount: bindingsCount,
        dataSize: dataSize,
        dataType: 'revisionable',
        testType: 'update',
      },
      log: './log'
    }, done);
  }
];

var product = [];
for (var s = 0; s < dataSizes.length; s += 1) {
  for (var c = 0; c < bindingsCount.length; c += 1) {
    product.push({
      dataSize: dataSizes[s],
      bindingsCount: bindingsCount[c]
    });
  }
}

product.forEach(function (data) {
  benchmarks.forEach(function (b) {
    it('should work wow', function (done) {
      b(data.bindingsCount, data.dataSize, done);
    });
  });
});
