'use strict';

app.controller('SessionListingCtrl', function($scope, SessionListing) {
	
	$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

	SessionListing.getAllSessions().
	then(sessionList => {
			$scope.sessions = sessionList
			console.log($scope.sessions)
	})

	$scope.getFavorites = (userName) => {
		SessionListing.getFavoritesList(userName)
		.then(favoritesList => {
			console.log(favoritesList)
			$scope.favoriteSessions = favoritesList
		})
	}
});
