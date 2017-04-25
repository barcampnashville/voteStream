	
angular.module('BarcampApp')
	.factory('AuthService', function ($http, $q, $location) {
		return {Users: ()=>{return $http.get('https://nashvillebarcamp.firebaseio.com/.json')
		}}
	})
;

