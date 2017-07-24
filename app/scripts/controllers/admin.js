'use strict';

app.controller('AdminCtrl', function ($scope, SessionList, Polling) {


  $scope.sessions = SessionList;
  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;

	console.log("$scope.sessions-->", $scope.sessions); 
  console.log("$scope.availability -->", $scope.availability);

});
