'use strict';

app.factory('SessionListing', function ($q, $http, Constants) {

	const realTimeSessions = firebase.database().ref('/Sessions')

	const getFavoritesList = (userName) => {
		return $http.get(`http://www.barcampnashville.org/bcn16/users/${userName}/attending`)
		.then(data => data.data["favorited sessions"])
	};

	return { realTimeSessions };
});
