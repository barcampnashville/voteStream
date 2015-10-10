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
        var favorites = [];
        var favoritesFromUser = [];
          $rootScope.user.ref.once('value', function (snapshot){
             if (snapshot.hasChild('favorites')) {
               $scope.userHasFavorites = true;
               favoritesFromUser = snapshot.favorites.val();
             }

          });
  /*$rootScope.Sessions.ref.once('value', function (snapshot){
    console.log(snapshot);
  })*/ console.log($rootScope);


})
;

//need to write a method that takes the information from the sessions and changes them based on whether someone favorited them and return that array as a view in the sessionlist.html
