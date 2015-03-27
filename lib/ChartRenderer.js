'use strict';

function getLayout(count, rect) {
  var entryHeight = 20;
  var left = rect.left;
  var result = [];
  var totalPerEntry = rect.height / count;
  for (var i = 0; i < count; i += 1) {
    result.push({
      top: (totalPerEntry - entryHeight) / 2 + rect.top + totalPerEntry * i,
      left: left
    });
  }
  return result;
}

function drawLegendEntry(ctx, data, layout) {
  ctx.fillStyle = '#444';
  ctx.font = '13px Verdana';
  ctx.textAlign = 'left';
  ctx.fillText(data.label, layout.left + 25, layout.top + 10);

  ctx.fillStyle = data.strokeColor;
  ctx.fillRect(layout.left, layout.top, 20, 20);
}

function drawLegend(ctx, rect, data) {
  var layout = getLayout(data.length, rect);
  data.forEach(function (d, i) {
    drawLegendEntry(ctx, d, layout[i]);
  });
}

function generateChart(labels, dataset) {
  var Canvas = require('canvas');
  var canvas = new Canvas(800, 500);
  var ctx = canvas.getContext('2d');
  var Chart = require('nchart');
  var data = {
    labels: labels,
    datasets: dataset
  };
  new Chart(ctx).Line(data);
  var legendSize = {
    left: 40,
    top: 12,
    width: 190,
    height: 70
  };
  drawLegend(ctx, legendSize, dataset);
  return canvas;
}

var fs = require('fs');
var ChartRenderer = {
  generate: function () {
  },
  save: function (filename, chart) {
    chart.toBuffer(function (err, buf) {
      if (err) {
        throw err;
      }
      if (!fs.existsSync(filename)) {
        fs.mkdirSync(filename);
      }
      fs.writeFileSync(filename, buf);
    });
  }
};

module.exports = ChartRenderer;
