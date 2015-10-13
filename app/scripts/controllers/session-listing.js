angular.module('BarcampApp')
	.controller('SessionListingCtrl', function($scope, $rootScope, Sessions, $http) {
		var user = $rootScope.user;
		$scope.sessions = Sessions;
		$scope.polling = $rootScope.pollingSync;

		$rootScope.pollingSync.$watch(function() {
			$scope.polling = $rootScope.pollingSync;
		});

		$rootScope.user.ref.once('value', function(snapshot) {
			if (snapshot.hasChild('sessions')) {
				var s = snapshot.val().sessions;
				for (var i = s.length - 1; i >= 0; i--) {
					$scope.sessions[s[i]].updateUserVoteStatus();
				}
			}
		});

		$scope.userFavorites = [];

		$rootScope.user.ref.once('value', function(snapshot) {
			if (snapshot.hasChild('favorites')) {
				$scope.userHasFavorites = true;
				Sessions.forEach(function(session) {
					if (snapshot.val().favoriteIds.indexOf(session.nid) > -1) {
						$scope.userFavorites.push(session);
					}
				});
			}
		});

		$scope.getFavorites = function() {
			$scope.submitting = true;
			$http.get('/favorites/' + $rootScope.user.id + '/' + $scope.barcampUsername).then(function(res) {
				var favorites = res.data.favoriteIds;
				Sessions.forEach(function(session) {
					if (favorites.indexOf(session.nid) > -1) {
						$scope.userFavorites.push(session);
					}
				});
			}).finally(function() {
				delete $scope.submitting;
			});
		}
})
;
