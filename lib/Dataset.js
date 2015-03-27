'use strict';

function Dataset(type, labels, values) {
  this.labels = labels;
  this.values = values;
  this.type = type;
}

module.exports = Dataset;
