'use strict';

app.controller('SessionListingCtrl', function($scope, $http, SessionListing, Vote, User, Polling, $location, AuthUser) {

	//jquery to control session tabs
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	//needs to be gotten from the cookies
	$scope.hasVoted = false;

	$scope.maxVotes = 4
 	$scope.user = AuthUser;
	if (window.document.cookie.includes('voteArray')) {
		$scope.voteArray = window.document.cookie.split('voteArray=')[1].split(',');
		$scope.hasVoted = true;
	}
	else {
		$scope.voteArray = [];
	}
	
	

	const getRemainingVotes = () => {
		console.log('voteArray:', $scope.voteArray)
		$scope.remainingVotes = $scope.maxVotes - $scope.voteArray.length;
	}

	getRemainingVotes()

	const setCookie = () => {
    let d = new Date();
    d.setTime(d.getTime() + (30*60*1000));
    let expires = "expires="+ d.toUTCString();
    window.document.cookie = `voteArray=${$scope.voteArray};${expires};`
  }


	//Polling.getPollingPeriods().then(period => $scope.polling = period)
	$scope.polling = {
		open: true,
		sessions: "morning"
	}
	/* Returns all sessions from services/sessions.js */
	SessionListing.getAllSessions().
	then(sessionList => {
		$scope.sessions = sessionList
	})

	/* User to select up to 4 sessions and add to voteArray */
	$scope.vote = (index, isChecked) => {
		if ($scope.voteArray.length < $scope.maxVotes && !$scope.voteArray.includes(index.toString())){
			$scope.voteArray.push(index.toString())


		} else if (!isChecked) {  //if checked box value is checked remove from voteArray
			$scope.voteArray.splice($scope.voteArray.indexOf(index), 1)
		}
		getRemainingVotes()
	}

	/* Submit user's votes and increment session's total_count in services/vote.js */
	$scope.voteSubmit = () => {
		if($scope.voteArray.length != 0) {
			let jsonArray = JSON.stringify($scope.voteArray);

			Vote.updateUserVotes($scope.user, jsonArray) // Update votes
			.then(function(response){
				Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
				setCookie();
			})
			if($scope.voteArray.length < 3 || $scope.voteArray.length === 4) {
				$scope.errorMessage = `Thanks, you have ${$scope.maxVotes - $scope.voteArray.length} votes left.`; // Update message
			}
			else {
				$scope.errorMessage = `Thanks, you have ${$scope.maxVotes - $scope.voteArray.length} vote left.`; // Update message
			}
			
		}
		else {
			$scope.errorMessage = "Please select a session.";
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

  $scope.logout = () => {
    User.userLogout()
    $location.path('/login')
  }

});
