function FilterRule(key, rule) {
  this.key = key;
  this.rule = rule;
}

FilterRule.prototype.apply = function (data) {
  return this.rule(data[this.key]);
};

module.exports = FilterRule;
