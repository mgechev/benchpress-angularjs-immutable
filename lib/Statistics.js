var Statistics = {
  mean: function (arr) {
    return arr.reduce(function (p, c) {
      return p + c;
    }, 0) / arr.length;
  }
};

module.exports = Statistics;
