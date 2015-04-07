var Dataset = require('./Dataset');
var Statistics = require('./Statistics');

function sort(labels, values, cmp) {
  var currentLabel, currentValue;
  var j;
  for (var i = 1; i < labels.length; i += 1) {
    currentLabel = labels[i];
    currentValue = values[i];
    j = i - 1;
    while (j >= 0 && cmp(labels[j], currentLabel) > 0) {
      labels[j + 1] = labels[j];
      values[j + 1] = values[j];
      j -= 1;
    }
    labels[j + 1] = currentLabel;
    values[j + 1] = currentValue;
  }
}

function RenderData(sets, labels, values) {
  this.setProp = sets;
  this.labelProp = labels;
  this.valueProp = values;
  this.sets = {};
}

RenderData.prototype.process = function (logs) {
  logs.forEach(function (log) {
    this.add([log.description.description[this.setProp]], log);
  }, this);
};

RenderData.prototype.add = function (key, data) {
  this.sets[key] = this.sets[key] || [];
  this.sets[key].push(data);
};

RenderData.prototype.aggregate = function (sortCb) {
  return Object.keys(this.sets).map(function (set) {
    return this.aggregateSet(set, this.sets[set], sortCb);
  }, this);
};

RenderData.prototype.aggregateSet = function (type, set, sortCb) {
  var labels = [];
  var values = [];
  set.forEach(function (s) {
    labels.push(s.description.description[this.labelProp]);
    values.push(Statistics.mean(s.validSample.map(function (c) {
      return c.values[this.valueProp];
    }, this)));
  }, this);
  if (sortCb) {
    sort(labels, values, sortCb);
  }
  return new Dataset(type, labels, values);
};

module.exports = RenderData;
