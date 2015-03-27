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
var DIR_NAME = './log/';
var CHART_DIR = './charts/';
var RenderData = require('./RenderData');
var Filter = require('./Filter');
var FilterRule = require('./FilterRule');
var ChartRenderer = require('./ChartRenderer');

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

var renderData = new RenderData(SETS, LABELS, VALUES);
renderData.process(logs);
var data = renderData.aggregate();
var labels = data[0].labels;

var chart = ChartRenderer.generate(labels, data);
var filters = FILTERS.map(function (f) {
  return f.key;
}).join('-');

ChartRenderer.save(chart, path.join(CHART_DIR) + filters + '.png');
