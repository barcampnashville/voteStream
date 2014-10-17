angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, $rootScope, Sessions, $firebase) {
		var user = $rootScope.user;
		$scope.sessions = Sessions;
		$scope.polling = $rootScope.pollingSync;

		$rootScope.pollingSync.$watch(function () {
			$scope.polling = $rootScope.pollingSync;
		});
		
		if (user.sessions) {
			for (var i = user.sessions.length - 1; i >= 0; i--) {
				$scope.sessions[user.sessions[i]].updateUserVoteStatus();
			}
		}
    })
;