'use strict';

app.factory('Session', function ($http) {

})

.factory('SessionListing', function ($http) {
	const getAllSessions = () => {
		return $http.get('https://nashvillebarcamp.firebaseio.com/Sessions.json')
		.then(data => data.data);
	}
	const getFavoritesList = (userName) => {
		return $http.get(`http://www.barcampnashville.org/bcn16/users/${userName}/attending`)
		.then(data => data.data["favorited sessions"])
	}
	return {getAllSessions, getFavoritesList}
});
