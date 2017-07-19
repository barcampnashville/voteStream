'use strict';

app.controller('AdminCtrl', function ($scope, SessionList) {

	$scope.sessions = SessionList;
	console.log("$scope.sessions-->", $scope.sessions); 


});
