'use strict';

app.factory('AuthService', function ($http) {

	const getAllUsers = () =>
		$http.get('https://nashvillebarcamp.firebaseio.com/.json')
		.then(data => data.data.Users);

	return { getAllUsers };

});
