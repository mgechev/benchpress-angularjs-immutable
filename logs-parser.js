'use strict';
var fs = require('fs');
var path = require('path');
var DIR_NAME = 'log';
var CSV_DIR = 'csv';

function parseResult(result) {
  function mean(arr) {
    return arr.reduce(function (p, v) {
      return p + v;
    }, 0) / arr.length;
  }
  var scriptTime = mean(result.validSample.map(function (d) {
    return d.values.scriptTime;
  }));
  var gcTime = mean(result.validSample.map(function (d) {
    return d.values.gcTime;
  }));
  return {
    scriptTime: scriptTime,
    gcTime: gcTime
  };
}

function generateCSV(obj) {
  var key = Object.keys(obj).map(Number);
  var speed = Object.keys(obj).map(function (k) {
    return obj[k].scriptTime;
  });
  var gc = Object.keys(obj).map(function (k) {
    return obj[k].gcTime;
  });
  return [key.join(','), speed.join(','), gc.join(',')].join('\n');
}

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
  results[dataSize] = results[dataSize] || {};
  results[dataSize][bindigsCount] = parseResult(json);
});

Object.keys(results).forEach(function (key) {
  var filename = key + '.csv';
  fs.writeFileSync(path.join(CSV_DIR, filename), generateCSV(results[key]));
});
