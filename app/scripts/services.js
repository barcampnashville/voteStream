(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.factory({

		SessionService: [
			function () {
				var ref = new Firebase('https://barcamp.firebaseio.com/Sessions/'),
				// object to store all references
				sessionRef = {};

				// Returns the Firebase reference for given Session ID
				function createReference (id) {
					if (!sessionRef.hasOwnProperty(id)) {
						sessionRef[id] = ref.child(id);
					}
					return sessionRef[id];
				}

				return {
					list: function () {},

					increaseVote: function (session) {
						var childRef = createReference(session.id);
						childRef.transaction(function (data) {
							data.total_votes += 1;
							return data;
						});
					},

					decreaseVote: function (session) {
						var childRef = createReference(session.id);
						childRef.transaction(function (data) {
							data.total_votes -= 1;
							return data;
						});
					}
				};
			}
		],

		AuthService: [
			'angularFireAuth', '$http',
			function (angularFireAuth, $http) {
				
				function onAuthResponse(response) {
					return angularFireAuth.login(response.data);
				}

				var ref = new Firebase('https://barcamp.firebaseio.com/'),
					api = {
						login: function (id) {
							return $http.post('/login', { id: id })
								.then(onAuthResponse);
						},

						isAuthenticated: function () {
							return false;
						},

						logout: function () {
							angularFireAuth.logout();
						}
					};

				angularFireAuth.initialize(ref, {scope: api, name: "user"});

				return api;
			}
		]
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
	});
}(window.angular));



