'use strict';

app.controller('SessionListingCtrl', function($scope, $http, SessionListing, Vote) {
	
  $scope.maxVotes = 4
  $scope.user = '1GW5Z18M' // refactor 
  $scope.voteArray = [];

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

  //returns all sessions from sessions.js in services
  SessionListing.getAllSessions().
  then(sessionList => {
      $scope.sessions = sessionList
      // console.log($scope.sessions)
  })

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
  		let jsonArray = JSON.stringify($scope.voteArray);

      Vote.updateUserVotes($scope.user, jsonArray) // refactor $scope.user?
  		.then(function(response){
        $scope.incrementingSessionVoteCount();
  		})
  		// update message
      $scope.errorMessage = "Thanks!";
  	}
  }


//increments the total vote count, is called after storing session votes to user object in firebase
  $scope.incrementingSessionVoteCount = () => {
    angular.forEach($scope.voteArray, function(session){
      var voteCountRef = firebase.database().ref(`Sessions/${session}/total_votes`);
      voteCountRef.transaction(function(voteCount) {
        return voteCount + 1;
      },(err, wasCommited, afterSnap) => {
        console.log('err', err);
        console.log('wasCommited', wasCommited);
        console.log('afterSnap', afterSnap.val());
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
