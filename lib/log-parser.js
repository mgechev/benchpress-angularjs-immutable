'use strict';

var SETS = 'dataType';
var LABELS = 'bindingsCount';
var VALUES = 'scriptTime';
var FILTERS = [{
  key: 'dataSize',
  value: function (val) {
    return val === 5;
  }
}];
var DIR_NAME = '../log/17-3-15/';
var RenderData = require('./RenderData');
var Filter = require('./Filter');
var FilterRule = require('./FilterRule');

var dataFilter = new Filter(FILTERS.map(function (f) {
  return new FilterRule(f.key, f.value);
}));

var fs = require('fs');
var path = require('path');
var files = fs.readdirSync(DIR_NAME);

files = files.filter(function (f) {
  return fs.statSync(path.join(DIR_NAME, f)).isFile();
});

// Elegant but not efficient, requires memory...
var logs = files.map(function (file) {
  return require('./' + path.join(DIR_NAME, file));
}).filter(function (data) {
  return dataFilter.filter(data.description.description);
});

console.log(logs.length);

var renderData = new RenderData(SETS, LABELS, VALUES);
renderData.process(logs);
console.log(renderData.aggregate());
