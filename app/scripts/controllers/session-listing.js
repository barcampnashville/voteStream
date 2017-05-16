'use strict';

app.controller('SessionListingCtrl', function($scope, SessionListing, $http) {
	
	//jquery to control session tabs
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
  	
	// check to see if the array is empty
		if ($scope.voteArray.length === 0){
			$scope.voteArray.push(index)
			// check to see if length is less than three AND voteArray does note include duplicate
		} else if( $scope.voteArray.length < 3 && !$scope.voteArray.includes(index)) {
  		$scope.voteArray.push(index)
		} else {
  		$scope.errorMessage = "You may select only 3 sessions.";
  		$("#error-modal").modal("show");
		}
  }

  $scope.voteSubmit = () => {
  	if($scope.voteArray.length < 3) {
  		$scope.errorMessage = "Please vote for 3 sessions before submitting!";
  	} else {

  	//****We don't have access to firebase to post yet****
  		
  		// $http.post('https://nashvillebarcamp.firebaseio.com/Users/1FY13NK8/sessions.json', $scope.voteArray)
  		// .then(function(response){
  		// 	console.log(response)
  		// })
  		//submit to Firebase

  	}
  }
  //returns all sessions from sessions.js in services
	SessionListing.getAllSessions().
	then(sessionList => {
			$scope.sessions = sessionList
			console.log($scope.sessions)
	})

	//takes barcampUsername from ng-submit in sessionlist.html
	$scope.getFavorites = (userName) => {
		$scope.favoritesArray = []

		//returns specific user's favorites from list coming from sessions.js
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
