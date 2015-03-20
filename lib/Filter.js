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

module.exports = Filter;
