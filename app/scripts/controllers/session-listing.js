angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, $rootScope, Sessions, $firebase) {
		var user = $rootScope.user;
		$scope.sessions = Sessions;
		$scope.polling = $rootScope.pollingSync;

		$rootScope.pollingSync.$watch(function () {
			$scope.polling = $rootScope.pollingSync;
		});

		$rootScope.user.ref.once('value', function (snapshot) {
			if (snapshot.hasChild('sessions')) {
				var s = snapshot.val().sessions;
				for (var i = s.length - 1; i >= 0; i--) {
					$scope.sessions[s[i]].updateUserVoteStatus();
				}
			}
		});

    var favoritesFromUser = [];
    $rootScope.user.ref.once('value', function (snapshot){
      if (snapshot.hasChild('favoriteIds')) {
        $scope.userHasFavorites = true;
        Sessions.forEach(function (session) {
          if (snapshot.val().favoriteIds.indexOf(session.nid) > -1){
            favoritesFromUser.push(session);
          }
        });
      }
    });
    $scope.userFavorites = favoritesFromUser;
});
