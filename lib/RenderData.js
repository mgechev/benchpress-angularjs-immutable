var Dataset = require('./Dataset');
var Statistics = require('./Statistics');

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

module.exports = RenderData;
