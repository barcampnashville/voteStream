'use strict';

app.factory('Vote', function($http, Constants) {


	/* Put request to update user's session votes */
	const updateUserVotes = (user, jsonArray) => {
		return $http.put(`${Constants.firebaseUrl}/Users/${user}/sessions.json`, jsonArray)
	};

	/* Increase the number of session's total_votes */
	const incrementSessionVoteCount = (voteArray, session) => {
		angular.forEach(voteArray, function(session){
			const voteCountRef = firebase.database().ref(`Sessions/${session}/total_votes`);
			voteCountRef.transaction(function(voteCount) {
			return voteCount + 1;
		}, (err, wasCommited, afterSnap) => {
			// console.log('err', err);
			// console.log('wasCommited', wasCommited);
			// console.log('afterSnap', afterSnap.val());
			})
		})
	};

	return {updateUserVotes, incrementSessionVoteCount};

});
