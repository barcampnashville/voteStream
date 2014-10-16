angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, $rootScope, AuthService, Sessions, $firebase) {
		var user = $rootScope.user;
		$scope.polling = $rootScope.pollingSync;

		$rootScope.pollingSync.$watch(function () {
			$scope.polling = $rootScope.pollingSync;
		});
		$scope.sessions = Sessions;
		user.sync.$loaded().then(function () {
			if (!user.sync.sessions) return;
			for (var i = user.sync.sessions.length -1; i >= 0; i--) {
				$scope.sessions[user.sync.sessions[i]].updateUserVoteStatus();
			}
		});
    })
;