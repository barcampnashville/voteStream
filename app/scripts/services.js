angular.module('BarcampApp')
	.factory('AuthService', function ($http, webStorage, $q, $location, $rootScope, $firebase) {
		var user = webStorage.get('user'),
			defer = $q.defer(),
			ref = new Firebase('https://barcamp.firebaseio.com/');

		if (user) {
			ref.auth(user.token, function (err) {
				if (!err) {
					$rootScope.user = user;
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
					$rootScope.user = {
						id: user.user.id,
						admin: user.user.admin,
						voteCounts: user.user.voteCounts
					};
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
