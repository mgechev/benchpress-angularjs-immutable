'use strict';

function formatResults(config) {
  var RenderData = require('./lib/RenderData');
  var Filter = require('./lib/Filter');
  var FilterRule = require('./lib/FilterRule');
  var ChartRenderer = require('./lib/ChartRenderer');

  var dataFilter = new Filter(config.filters.map(function (f) {
    return new FilterRule(f.key, f.value);
  }));

  var fs = require('fs');
  var path = require('path');
  var files = fs.readdirSync(config.DIR_NAME);

  files = files.filter(function (f) {
    return fs.statSync(path.join(config.DIR_NAME, f)).isFile();
  });

  // Elegant but not efficient, requires memory...
  var logs = files.map(function (file) {
    return require('./' + path.join(config.DIR_NAME, file));
  }).filter(function (data) {
    return dataFilter.filter(data.description.description);
  });

  var renderData = new RenderData(config.sets, config.labels, config.values);
  renderData.process(logs);
  var data = renderData.aggregate();
  var labels = data[0].labels;

  var chart = ChartRenderer.generate(labels, data);
  ChartRenderer.save(chart, path.join(config.CHART_DIR) + config.filename + '.png');
}

var SETS = 'dataType';
var LABELS = 'bindingsCount';
var VALUES = 'scriptTime';
var DIR_NAME = './log/';
var CHART_DIR = './charts/';

[5, 10, 20, 50, 100, 500, 1000, 2000, 5000, 10000, 100000]
  .forEach(function (s) {
    formatResults({
      filename: 'data-size-' + s,
      sets: SETS,
      labels: LABELS,
      values: VALUES,
      filters: [{
        key: 'dataSize',
        value: function (val) {
          return val === s;
        }
      }],
      DIR_NAME: DIR_NAME,
      CHART_DIR: CHART_DIR
    });
  });
