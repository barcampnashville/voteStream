'use strict';

app.controller('SessionListingCtrl', function($scope, $location, Vote, User, Constants, AuthUser, Polling, SessionList) {

	// Scoped Variables
	$scope.maxVotes = Constants.maxVotes;
	$scope.user = AuthUser;
	$scope.polling;
	$scope.sessions = SessionList;
	$scope.tab;

	//$scope.polling = PollingPeriod;
	Polling.realTimePolling.on('value', function(polling){
    $scope.polling = Polling.determineSession(polling.val().pollingPeriods)
    $scope.tab = $scope.polling.sessions;
    $scope.$apply();
  });

  // SessionListing.realTimeSessions.on('value', function(session){
		// $scope.sessions = session.val();
  //   $scope.$apply();
  //   console.log("$scope.sessions:", $scope.sessions);
  // });
  $scope.showTab = tab => {
  	$scope.tab = tab;
  }	

	// Methods
	$scope.addVote = index => {
		$scope.voteArray.push(index.toString());
	};

	$scope.editMode = () => {
		$scope.hasUserVoted = false;
	};

	$scope.getRemainingVotes = () => {
		$scope.remainingVotes = $scope.maxVotes - $scope.voteArray.length;
	};

	$scope.isVotingOpen = (session) => {
		return ($scope.polling.open && $scope.polling.sessions === session);
	};

	$scope.logout = () => {
		User.userLogout();
		$location.path('/login');
	};

	$scope.removeVote = index => {
		$scope.voteArray.splice($scope.voteArray.indexOf(index.toString()), 1);
	};

	$scope.resetVote = () => {
		// If a user resets votes while there are no votes, do nothing. Display modal?
		if (!$scope.voteArray.length) {
			$scope.voteArray = [];

		// Only set hasVoted to true if there have been previous votes
		} else if ($scope.voteArray.length) {
			const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];
			$scope.voteArray = (votes !== '') ? votes.split(',') : [];
			$scope.hasUserVoted = (votes !== '') ? true : false;
		}

		$scope.getRemainingVotes();
	};

	$scope.setCookie = () => {
			const d = new Date();
			d.setTime(d.getTime() + (30*60*1000));
			const expires = `expires=${d.toUTCString()}`;
			window.document.cookie = `voteArray=${$scope.voteArray};${expires};`
	};

	$scope.getTitles = () => {
		$scope.titlesArray = [];
			for(let i = 0; i < $scope.voteArray.length; i++) {
				let arrayIndex = parseInt($scope.voteArray[i])
				let listNumber = i + 1;
				$scope.titlesArray.push(listNumber + ') ' + $scope.sessions[`${arrayIndex}`].Title)
			}
			return $scope.titlesArray
	}

	$scope.updateModalMsg = () => {
		if($scope.voteArray.length <= 4 && $scope.voteArray.length > 0) {
			$scope.errorMessage = "Thank you for voting, you selected: "
			$scope.getTitles()
		} 
	};

	//1INVESSA
	$scope.removeSelectedSessions = (index) => {
		$scope.sessions.splice(index, 1);
	}
	
	// Submit user's votes and increment session's total_count in services/vote.js
	$scope.voteSubmit = () => {
		if ($scope.voteArray.length !== 0) {
			const jsonArray = JSON.stringify($scope.voteArray);
			Vote.updateUserVotes($scope.user, jsonArray) // Update votes
			.then(function(response){
				Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
				$scope.setCookie();
				$scope.hasUserVoted = true;
			});

			$scope.updateModalMsg();
		} else {
			$scope.errorMessage = "Please select a session to vote.";
		}
	};

	// Initial page JS - need methods to be defined before this is executed
	if (window.document.cookie.includes('voteArray')) {
		// Store the votes string e.g. '0,2,5' or ''
		const votes = window.document.cookie.split('voteArray=')[1].split(';')[0];

		// Determine if votes string has votes or is and empty string and assign voteArray and hasVoted values accordingly
		$scope.voteArray = (votes !== '') ? votes.split(',') : [];
		$scope.hasUserVoted = (votes !== '') ? true : false;
	} else {
		$scope.voteArray = [];
		// Setting cookie to help determine if user has not voted by initially storing an empty voteArray on the cookie
		$scope.setCookie();
	}

	$scope.getRemainingVotes();
});
