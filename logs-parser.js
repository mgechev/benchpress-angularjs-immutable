'use strict';
var fs = require('fs');
var path = require('path');
var DIR_NAME = 'log';

var files = fs.readdirSync(DIR_NAME);
var results = {};

files = files.filter(function (f) {
  return fs.statSync(path.join(DIR_NAME, f)).isFile();
});

files.forEach(function (file) {
  var json = require('./' + path.join(DIR_NAME, file));

  var idArr = json.description.id.split('-');

  var dataSize = parseInt(idArr[1]);
  var bindigsCount = parseInt(idArr[2]);

  function mean(arr) {
    return arr.reduce(function (p, v) {
      return p + v;
    }, 0) / arr.length;
  }

  var scriptTime = mean(json.validSample.map(function (d) {
    return d.values.scriptTime;
  }));

  var gcTime = mean(json.validSample.map(function (d) {
    return d.values.gcTime;
  }));

  results[dataSize] = results[dataSize] || {};
  results[dataSize][bindigsCount] = {
    scriptTime: scriptTime,
    gcTime: gcTime
  };
});

console.log(results);
