'use strict';

app.factory('Session', function ($http) {

})

.factory('SessionListing', function ($http) {
	const getAllSessions = () => {
		return $http.get('https://nashvillebarcamp.firebaseio.com/Sessions.json')
		.then(data => data.data);
	}
	return {getAllSessions}
});
