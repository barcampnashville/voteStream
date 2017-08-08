'use strict';

app.factory('SessionListing', function ($http, Constants) {

	const getAllSessions = () => {
		return $http.get(`${Constants.firebaseUrl}/Sessions.json`)
		.then(data => data.data);
	};

	const getFavoritesList = (userName) => {
		return $http.get(`http://www.barcampnashville.org/bcn16/users/${userName}/attending`)
		.then(data => data.data["favorited sessions"])
	};

	return { getAllSessions, getFavoritesList };
});
