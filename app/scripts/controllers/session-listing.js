'use strict';

app.controller('SessionListingCtrl', function($scope, $http, SessionListing, Vote, User, Polling, $location) {
	// TODO inject this after testing
	// AuthUser

	//jquery to control session tabs
	$('#myTabs a').click(function (e) {
		e.preventDefault()
		$(this).tab('show')
	})

	const setCookie = () => {
	    let d = new Date();
	    d.setTime(d.getTime() + (30*60*1000));
	    let expires = "expires="+ d.toUTCString();
	    window.document.cookie = `voteArray=${$scope.voteArray};${expires};`
	}

	$scope.getRemainingVotes = () => {
		console.log('voteArray:', $scope.voteArray)
		$scope.remainingVotes = $scope.maxVotes - $scope.voteArray.length;
	}

	// TODO add these to a factory
	// Used for checkbox directive
	$scope.addVote = function(index) {
		// $scope.voteArray = ["5", "7"]; // This will change which checkboxes are checked
		//this.voteArray = []; // Example, this will trigger a change
		$scope.voteArray.push(index.toString());
		console.log('this.voteArray', $scope.voteArray);
	};

	$scope.arrayHasVote = function(index) {
		return $scope.voteArray.includes(index.toString());
	};

	$scope.removeVote = function(index) {
		$scope.voteArray.splice($scope.voteArray.indexOf(index.toString()), 1);
		console.log('this.voteArray', $scope.voteArray);
	};

	//needs to be gotten from the cookies
	$scope.hasVoted = false;
	$scope.maxVotes = 4
	// 	$scope.user = AuthUser;
	// TODO uncomment this after
	$scope.user = '2BFJQPYM';

	if (window.document.cookie.includes('voteArray')) {
		// Store the votes string e.g. '0,2,5' or ''
		const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];

		// Determine if votes string has votes or is and empty string and assign voteArray and hasVoted values accordingly
		$scope.voteArray = (votes !== '') ? votes.split(',') : [];
		$scope.hasVoted = (votes !== '') ? true : false;
	}
	else {
		$scope.voteArray = [];
		// Setting cookie to help determine if user has not voted by initially storing an empty voteArray on the cookie
		setCookie();
	}

	$scope.getRemainingVotes();

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

	$scope.editMode = () => {
		$scope.hasVoted = false;
	}

	$scope.resetVote = () => {
		// If a user resets votes while there are no votes, do nothing. Display modal?
		if (!$scope.voteArray.length)
			$scope.voteArray = [];

		// Only set hasVoted to true if there have been previous votes
		else if ($scope.voteArray.length) {
			const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];
			$scope.voteArray = (votes !== '') ? votes.split(',') : [];
			$scope.hasVoted = (votes !== '') ? true : false;
		}

		$scope.getRemainingVotes();
	};

	/* Submit user's votes and increment session's total_count in services/vote.js */
	$scope.voteSubmit = () => {
		if($scope.voteArray.length !== 0) {
			let jsonArray = JSON.stringify($scope.voteArray);

			Vote.updateUserVotes($scope.user, jsonArray) // Update votes
			.then(function(response){
				Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
				setCookie();
				$scope.hasVoted = true;
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
	// $scope.getFavorites = (userName) => {
	// 	$scope.favoritesArray = []
	//
	// 	//returns specific user's favorites from list coming from sessions.js
	// 	SessionListing.getFavoritesList(userName)
	// 	.then(favoritesList => {
	// 		$scope.favoriteSessions = favoritesList
	// 		console.log("list from drupal:", $scope.favoriteSessions)
	//
	// 		//nested loop compares favorites from drupal site with all sessions
	// 		for (let i = 0; i < $scope.sessions.length; i++) {
	// 			for (let j = 0; j < $scope.favoriteSessions.length; j++) {
	// 				if($scope.sessions[i].Nid.toString() === $scope.favoriteSessions[j].session.Nid) {
	// 					$scope.favoritesArray.push($scope.sessions[i])
	// 				}
	// 			}
	// 		}
	// 		console.log("list after comparison:", $scope.favoritesArray)
	// 	})
	// }

	$scope.logout = () => {
		User.userLogout();
		$location.path('/login');
	}

});
