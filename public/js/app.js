/* global Immutable, angular */

var benchmarks = angular.module('benchmarks', ['immutable']);

function generateData(size) {
  'use strict';
  var result = [];
  for (var i = 0; i < size; i += 1) {
    result.push(Math.random());
  }
  return size;
}

function SampleCtrl($scope, $location) {
  'use strict';
  var size = $location.search().size;
  $scope.bindImmutable = function () {
    $scope.immutable = Immutable.List(generateData(size));
  };
  $scope.bindStandard = function () {
    $scope.standard = generateData(size);
  };
  $scope.clearStandard = function () {
    $scope.standard = null;
  };
  $scope.clearImmutable = function () {
    $scope.immutable = null;
  };
  $scope.clear = function () {
    $scope.clearStandard();
    $scope.clearImmutable();
  };
}

benchmarks
  .controller('SampleCtr', SampleCtrl);
