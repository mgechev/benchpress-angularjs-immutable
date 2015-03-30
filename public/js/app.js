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
  var dataSize = parseInt($location.search().dataSize, 10);
  var bindingsCount = parseInt($location.search().bindingsCount || 0);
  var watchers = {
    immutable: [],
    standard: []
  };

  function addWatchers(expr, count, collection) {
    for (var i = 0; i < count; i += 1) {
      collection.push($scope.$watch(function () {
        return $scope[expr];
      }, function () {
        console.log('Change!');
      }, false));
    }
  }

  function addCollectionWatchers(expr, count, collection) {
    for (var i = 0; i < count; i += 1) {
      collection.push($scope.$watchCollection(expr, function () {
        console.log('Change!');
      }));
    }
  }

  function clearWatchers(watchers) {
    var listeners = watchers || [];
    listeners.forEach(function (l) {
      l();
    });
  }

  function generateRandomIndx(length) {
    return Math.floor(Math.random() * (length - 1));
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

  // Updates the current value of the `standard` collection
  $scope.updateStandard = function () {
    if (!$scope.standard) {
      $scope.standard = generateData(dataSize);
    } else {
      var idx = generateRandomIndx(dataSize);
      $scope.standard[idx] = Math.random();
    }
  };

  // Updates the current value of the `immutable` collection
  $scope.updateImmutable = function () {
    if (!$scope.immutable) {
      $scope.immutable = Immutable.List(generateData(dataSize));
    } else {
      // We can cache the plain collection here
      var idx = generateRandomIndx(dataSize);
      $scope.immutable = $scope.immutable.set(idx, Math.random());
    }
  };

  // In case we are running benchmark, which changes the array
  if ($location.search().change) {
    addWatchers('immutable', bindingsCount, watchers.immutable);
    addCollectionWatchers('standard', bindingsCount, watchers.standard);
  }

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
