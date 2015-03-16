'use strict';

var fs = require('fs');
var path = require('path');
var DIR_NAME = 'log';
var date = new Date();
var dateSuffix = date.getDate() + '-' +
  (date.getMonth() + 1) + '-' +
  (date.getYear() % 100);
var CHART_DIR = 'charts/' + dateSuffix;

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

function generateChart(labels, dataset) {
  var Canvas = require('canvas');
  var canvas = new Canvas(600, 400);
  var ctx = canvas.getContext('2d');
  var Chart = require('nchart');
  var data = {
    labels: labels,
    datasets: dataset
  };
  new Chart(ctx).Line(data);
  return canvas;
}

var files = fs.readdirSync(DIR_NAME);
var results = {};

files = files.filter(function (f) {
  return fs.statSync(path.join(DIR_NAME, f)).isFile();
});

// Creates nested data structure like:
// Object
//  - data type (standard, immutable, whatever)
//    - data size
//      - bindings count
//        - [results...]
files.forEach(function (file) {
  var json = require('./' + path.join(DIR_NAME, file));
  var idArr = json.description.id.split('-');
  var type = idArr[0];
  var dataSize = parseInt(idArr[1]);
  var bindigsCount = parseInt(idArr[2]);
  results[type] = results[type] || {};
  results[type][dataSize] = results[type][dataSize] || {};
  results[type][dataSize][bindigsCount] = parseResult(json);
});

var colors = [{
  fillColor: 'rgba(220,220,220,0.2)',
  strokeColor: 'rgba(220,220,220,1)',
  pointColor: 'rgba(220,220,220,1)',
  pointStrokeColor: '#fff',
  pointHighlightFill: '#fff',
  pointHighlightStroke: 'rgba(220,220,220,1)',
}, {
  fillColor: 'rgba(151,187,205,0.2)',
  strokeColor: 'rgba(151,187,205,1)',
  pointColor: 'rgba(151,187,205,1)',
  pointStrokeColor: '#fff',
  pointHighlightFill: '#fff',
  pointHighlightStroke: 'rgba(151,187,205,1)',
}];

function formatStatistics(perfProp) {
  var dataStructures = Object.keys(results);
  var dummy = dataStructures[0];
  // Since all data-structures have the same
  // collection sizes we need to iterate over one of them
  // and get information for all data structures' sizes
  Object.keys(results[dummy]).forEach(function (size) {
    var filename = perfProp + '-' + size + '.png';
    var labels = Object.keys(results[dummy][size]);
    var current = 0;
    var dataset = [];
    // Now for each data structure we generate statistics
    // in order to visialize the data on the same chart
    dataStructures.forEach(function (type) {
      var data = {};
      var color = colors[current];
      current += 1;
      for (var prop in color) {
        data[prop] = color[prop];
      }
      data.label = type;
      var bindings = results[type][size];
      // For each count of the bindings we take the values
      // received by the benchmark
      data.data = Object.keys(bindings).map(function (binding) {
        return bindings[binding][perfProp];
      });
      dataset.push(data);
    });
    // We draw the result onto a canvas
    var canvas = generateChart(labels, dataset);
    canvas.toBuffer(function (err, buf) {
      if (err) {
        throw err;
      }
      fs.writeFileSync('./' + CHART_DIR + '/' + filename, buf);
    });
  });
}

// Get statistics for both - scriptTime and gcTime
formatStatistics('scriptTime');
formatStatistics('gcTime');
