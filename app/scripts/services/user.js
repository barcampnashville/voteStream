'use strict';

app.factory('User', function($http) {

	let user;
	
	// getter
	const getUser = () => {
		return user;
	}

	// setter
	const setUser = (badgeId) => {
		user = badgeId;
	}

	return {getUser, setUser};

});
