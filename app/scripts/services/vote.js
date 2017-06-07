'use strict';

app.factory('Vote', function($http) {

	const updateUserVotes = (user, jsonArray) => {
		return $http.put(`https://nashvillebarcamp.firebaseio.com/Users/${user}/sessions.json`, jsonArray)
	}

	return {updateUserVotes}

})