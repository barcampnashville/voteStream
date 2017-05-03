'use strict';

app.controller('SessionListingCtrl', function($scope, SessionListing) {
	
	$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })

	// TODO will make better i promise 
  $scope.polling = {
  	open: true,
  	sessions: 'morning'
  }

  $scope.user = '1FY13NK8'
	$scope.voteArray = []

  $scope.vote = (index) => {
  	//Need to make sure user can't vote for a session twice
  	//Need error handling for more than 3 votes
  	if( $scope.voteArray.length < 3) {
  		$scope.voteArray.push(index)
  		console.log("voteArray: ", $scope.voteArray)
  	} 
  }

	SessionListing.getAllSessions().
	then(sessionList => {
			$scope.sessions = sessionList
			console.log($scope.sessions)
	})

	$scope.getFavorites = (userName) => {
		$scope.favoritesArray = []
		SessionListing.getFavoritesList(userName)
		.then(favoritesList => {
			$scope.favoriteSessions = favoritesList
			console.log("list from drupal:", $scope.favoriteSessions)

			//nested loop compares favorites from drupal site with all sessions
			for (let i = 0; i < $scope.sessions.length; i++) {
				for (let j = 0; j < $scope.favoriteSessions.length; j++) {
					if($scope.sessions[i].Nid.toString() === $scope.favoriteSessions[j].session.Nid) {
						$scope.favoritesArray.push($scope.sessions[i])
					}
				}
			}
			console.log("list after comparison:", $scope.favoritesArray)
		})
	}
});
