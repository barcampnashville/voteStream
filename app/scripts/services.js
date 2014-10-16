angular.module('BarcampApp')
	.factory('AuthService', function ($http, webStorage, $location, $rootScope, $firebase, User) {
		var user = webStorage.get('user'),
			ref = new Firebase('https://barcamp.firebaseio.com/');

		if (user) {
			ref.auth(user.token, function (err) {
				if (!err) {
					$rootScope.user = new User(user.user);
					$location.path('/sessions');
					$rootScope.$apply();
				}
			});
		}
		var sync = $firebase(ref);
		console.log(sync.$asObject());

		function onAuthResponse(response) {
			var user = response.data;
			webStorage.add('user', user);
			ref.auth(user.token, function (err, me) {
				if (!err) {
					$rootScope.user = new User(user.user);
					$location.path('/sessions');
					$rootScope.$apply();
				}
			});
		}

		return {
			login: function (id) {
				return $http.post('/login', { id: id }).then(onAuthResponse);
			},

			logout: function () {
				ref.unauth();
				$rootScope.user = null
				webStorage.remove('user');
				$location.path('/login');
			}
		};
	})
	.filter('orderObjectBy', function () {
		return function (items, field, reverse) {
			var filtered = [];
			angular.forEach(items, function (item) {
				filtered.push(item);
			});
			filtered.sort(function (a, b) {
				if(a[field] > b[field]) return 1;
				if (a[field] < b[field]) return -1;
				return 0;
			});
			if(reverse) filtered.reverse();
			return filtered;
		};
	})
;
