'use strict';

app.controller('SessionListingCtrl', function($scope, $http, SessionListing, Vote, User) {
	
	//jquery to control session tabs
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})


	$scope.maxVotes = 4
 	$scope.user = User.getUser();


	$scope.voteArray = [];

	// TODO 
	$scope.polling = {
		open: true,
		sessions: 'morning'
	}

	/* Returns all sessions from services/sessions.js */
	SessionListing.getAllSessions().
	then(sessionList => {
		$scope.sessions = sessionList
		// console.log("$scope.sessions-->", $scope.sessions); 
	})

	/* User to select up to 4 sessions and add to voteArray */
	$scope.vote = (index, isChecked) => {
		if ($scope.voteArray.length < $scope.maxVotes && !$scope.voteArray.includes(index)){
			$scope.voteArray.push(index.toString())
		} else if (!isChecked) {  //if checked box value is checked remove from voteArray
			$scope.voteArray.splice($scope.voteArray.indexOf(index), 1)
		}
	}

	/* Submit user's votes and increment session's total_count in services/vote.js */
	$scope.voteSubmit = () => {
		if($scope.voteArray.length < $scope.maxVotes) {
			$scope.errorMessage = "Please vote for 4 sessions before submitting!";

		} else {
			let jsonArray = JSON.stringify($scope.voteArray);

			Vote.updateUserVotes($scope.user, jsonArray) // Update votes 
			.then(function(response){
				Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
			})
			$scope.errorMessage = "Thanks!"; // Update message
		}
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
