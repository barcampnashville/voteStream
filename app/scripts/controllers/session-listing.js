'use strict';

app.controller('SessionListingCtrl', function($scope, $location, Vote, User, Constants, AuthUser, Polling, SessionList) {

	// Scoped Variables
	$scope.maxVotes = Constants.maxVotes;
	$scope.user = AuthUser;
	$scope.polling;
	$scope.sessions = SessionList;
	$scope.tab = undefined;
	let cookieArray;

	Polling.realTimePolling.on('value', function(polling){
	    $scope.polling = Polling.determineSession(polling.val());

	    //initial funcitons to run when polling object is originally returned
	   	if ($scope.tab === undefined) {
	   		$scope.tab = $scope.polling.sessions;
	    	cookieArray = $scope.tab === 'morning' ? 'morningVoteArray' : 'afternoonVoteArray';
	    	setVoteArray();
	    	$scope.getRemainingVotes();
	   	}
	    $scope.$apply();
	});

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
			const votes = window.document.cookie.split(`${cookieArray}=`)[1].split(';')[0];
			$scope.voteArray = (votes !== '') ? votes.split(',') : [];
			$scope.hasUserVoted = (votes !== '') ? true : false;
		}
	};

	$scope.setCookie = () => {
			const d = new Date();
			d.setTime(d.getTime() + (30*60*1000));
			const expires = `expires=${d.toUTCString()}`;
			window.document.cookie = `${cookieArray}=${$scope.voteArray};${expires};`
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

	$scope.finishVote = () => {
		$scope.setCookie();
		$scope.hasUserVoted = true;
		$scope.updateModalMsg();
	}


	// Submit user's votes and increment session's total_count in services/vote.js
	$scope.voteSubmit = () => {
		const jsonArray = JSON.stringify($scope.voteArray);

		// If user has not voted, increment
		if (!window.document.cookie.includes(`${cookieArray}`)) {
			Vote.updateUserVotes($scope.user, jsonArray)  // Update votes in services/vote.js
				.then(function(response){
					Vote.incrementSessionVoteCount($scope.voteArray, $scope.sessions) // Increment votes
				});

			$scope.finishVote();

		// If the user has already voted, increment or decrement in edit mode.
		} else if (window.document.cookie.includes(`${cookieArray}`)) {  // if a cookie exist, compare old values
			let cookie = window.document.cookie.split(`${cookieArray}=`)[1].split(';')[0]; // returns string "1,2,3,4"

			// compare votes
			let newVote = $scope.voteArray;
			let oldVote = (cookie !== "") ? cookie.split(',') : [];

			// let unchangedVotes = newVote.filter(x => oldVote.indexOf(x) != 1); // votes - no change
			let incrementVote = newVote.filter(x => oldVote.indexOf(x) == -1); // array of votes to decrement
			let decrementVote = oldVote.filter(x => newVote.indexOf(x) == -1); // array of votes to increment

			console.log('incrementVote', incrementVote);
			console.log('decrementVote', decrementVote);

			// Update votes in services/vote.js
			Vote.updateUserVotes($scope.user, jsonArray)
				.then(function(response) {
						Vote.decrementSessionVoteCount(decrementVote, $scope.sessions); // decrement
				}).then(function(response) {
						Vote.incrementSessionVoteCount(incrementVote, $scope.sessions); // increment
				});

			$scope.finishVote();
		} else {
			$scope.errorMessage = "Please select a session to vote.";
		}
	};


	// Initial page JS - need methods to be defined before this is executed
	const setVoteArray = () => {
		if ($scope.polling.open === true && window.document.cookie.includes(`${cookieArray}`)) {
			// Store the votes string e.g. '0,2,5' or ''
			const votes = window.document.cookie.split(`${cookieArray}=`)[1].split(';')[0];
			// Determine if votes string has votes or is and empty string and assign voteArray and hasVoted values accordingly
			$scope.voteArray = (votes !== '') ? votes.split(',') : [];
			$scope.hasUserVoted = (votes !== '') ? true : false;
		} else {
			$scope.voteArray = [];
			// Setting cookie to help determine if user has not voted by initially storing an empty voteArray on the cookie
			$scope.setCookie();
		}
	}

});
