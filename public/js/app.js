/* global Immutable, angular */

var benchmarks = angular.module('benchmarks', ['immutable']);

function generateData(size) {
  'use strict';
  var result = [];
  for (var i = 0; i < size; i += 1) {
    result.push(Math.random());
  }
  return result;
}

function SampleCtrl($scope, $location) {
  'use strict';
  var dataSize = $location.search().dataSize;
  var bindingsCount = $location.search().bindingsCount || 0;
  var watchers = {
    immutable: [],
    standard: []
  };

  function addWatchers(expr, count, collection) {
    for (var i = 0; i < count; i += 1) {
      collection.push($scope.$watch(expr, function () {}));
    }
  }

  function addCollectionWatchers(expr, count, collection) {
    for (var i = 0; i < count; i += 1) {
      collection.push($scope.$watchCollection(expr, function () {}));
    }
  }

  function clearWatchers(watchers) {
    var listeners = watchers || [];
    listeners.forEach(function (l) {
      l();
    });
  }

  // Creates a new immutable collection with the specified size
  // and binds it to the local property `immutable`.
  // Also adds the specified number of watchers to the
  // `immutable` property.
  $scope.bindImmutable = function () {
    $scope.immutable = Immutable.List(generateData(dataSize));
    addWatchers('immutable', bindingsCount, watchers.immutable);
  };

  // Creates a new standard JS array with the specified size
  // and binds it to the local property `standard`.
  // Also adds the specified number of watchers to the
  // `standard` property.
  $scope.bindStandard = function () {
    $scope.standard = generateData(dataSize);
    addCollectionWatchers('standard', bindingsCount, watchers.standard);
  };

  // Clears the `immutable` collection and removes all
  // listeners attached to it (except ng-repeat in the template).
  function clearImmutable() {
    $scope.immutable = null;
    clearWatchers(watchers.immutable);
    watchers.immutable = [];
  }

  // Clears the `standard` collection and removes all
  // listeners attached to it (except ng-repeat in the template).
  function clearStandard() {
    $scope.standard = null;
    clearWatchers(watchers.standard);
    watchers.standard = [];
  }

  // Clears the both collections and all attached listeners to them.
  $scope.clear = function () {
    clearStandard();
    clearImmutable();
  };
}

benchmarks
  .controller('SampleCtrl', SampleCtrl);
