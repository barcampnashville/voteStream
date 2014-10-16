angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, $rootScope, AuthService, Sessions, $firebase) {
		var user = $rootScope.user;
		$scope.polling = $rootScope.pollingSync;
		
		$rootScope.pollingSync.$watch(function () {
			$scope.polling = $rootScope.pollingSync;
		});
		$scope.sessions = Sessions;
		user.sync.$loaded().then(function () {
			if (!user.sessions) return;
			for (var i = user.sessions.length -1; i >= 0; i--) {
				$scope.sessions[user.sessions[i]].updateUserVoteStatus();
			}
		})
    })
;