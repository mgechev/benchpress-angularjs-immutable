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
var DIR_NAME = './log/17-3-15/';
var Dataset = require('./Dataset.js');


var Statistics = {
  mean: function (arr) {
    return arr.reduce(function (p, c) {
      return p + c;
    }, 0) / arr.length;
  }
};

function RenderData(sets, labels, values) {
  this.setProp = sets;
  this.labelProp = labels;
  this.valueProp = values;
  this.sets = {};
}

RenderData.prototype.process = function (logs) {
  logs.forEach(function (log) {
    this.add([log.description.description[SETS]], log);
  }, this);
};

RenderData.prototype.add = function (key, data) {
  this.sets[key] = this.sets[key] || [];
  this.sets[key].push(data);
};

RenderData.prototype.aggregate = function () {
  return Object.keys(this.sets).map(function (set) {
    return this.aggregateSet(this.sets[set]);
  }, this);
};

RenderData.prototype.aggregateSet = function (set) {
  var labels = [];
  var values = [];
  set.forEach(function (s) {
    labels.push(s.description.description[this.labelProp]);
    values.push(Statistics.mean(s.validSample.map(function (c) {
      return c.values[this.valueProp];
    }, this)));
  }, this);
  return new Dataset(labels, values);
};

function FilterRule(key, rule) {
  this.key = key;
  this.rule = rule;
}

FilterRule.prototype.apply = function (data) {
  return this.rule(data[this.key]);
};

function Filter(rules) {
  this.rules = rules;
}

// Could be optimized to return after the first
// unsuccessful rule but it looks so beautiful...
Filter.prototype.filter = function (data) {
  return this.rules.reduce(function (p, rule) {
    return p && rule.apply(data);
  }, true);
};

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
