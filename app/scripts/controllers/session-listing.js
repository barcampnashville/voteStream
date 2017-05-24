'use strict';

app.controller('SessionListingCtrl', function($scope, SessionListing, $http) {
	
  $scope.maxVotes = 4

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


  $scope.user = '1GW5Z18M'
	$scope.voteArray = [];

  $scope.vote = (index, isChecked) => {
    if ($scope.voteArray.length < $scope.maxVotes && !$scope.voteArray.includes(index)){
      $scope.voteArray.push(index.toString())
    } else if (!isChecked) {  //if checked box value is checked remove from voteArray
      $scope.voteArray.splice($scope.voteArray.indexOf(index), 1)
    }
  }

  $scope.voteSubmit = () => {
  	if($scope.voteArray.length < $scope.maxVotes) {
  		$scope.errorMessage = "Please vote for 4 sessions before submitting!";
  	} else {

  	//****We don't have access to firebase to post yet****
  		let jsonArray = JSON.stringify($scope.voteArray);
  		$http.put(`https://nashvillebarcamp.firebaseio.com/Users/${$scope.user}/sessions.json`, jsonArray)
  		.then(function(response){
  			console.log(response)
        $scope.incrementingSessionVoteCount();
  		})
  		// submit to Firebase
      $scope.errorMessage = "Thanks!";
  	}
  }
  //returns all sessions from sessions.js in services
	SessionListing.getAllSessions().
	then(sessionList => {
			$scope.sessions = sessionList
			console.log($scope.sessions)
	})

//increments the total vote count, is called after storing session votes to user object in firebase
  $scope.incrementingSessionVoteCount = () => {
    angular.forEach($scope.voteArray, function(session){
      var bob = firebase.database().ref();
      var bobRef = bob.child(`Sessions/${session}/total_votes`);
      bobRef.transaction(function(voteCount) {
        console.log("Vote Count", voteCount)
        return voteCount + 1;
    }) 
  });
}

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
