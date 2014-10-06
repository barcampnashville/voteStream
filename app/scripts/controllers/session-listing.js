angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, AuthService, Sessions) {
		$scope.sessions = Sessions;

		$scope.vote = function (session) {
			console.log($scope.user);
		}
    })
;