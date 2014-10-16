angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, AuthService, Sessions, $firebase) {
    	var user = $scope.user.sync;
		$scope.sessions = Sessions;
		user.$loaded().then(function () {
			for (var i = user.sessions.length -1; i >= 0; i--) {
				$scope.sessions[user.sessions[i]].updateUserVoteStatus();
			}
		})
    })
;