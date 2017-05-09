'use strict';

app.factory('AuthService', function ($http) {

	//ajax call to firebase pulling out Users objects from the json
	//used in signin.js
	const getAllUsers = () => {
		return $http.get('https://nashvillebarcamp.firebaseio.com/.json')
		.then(data => data.data.Users);
	}

	return { getAllUsers };

});
