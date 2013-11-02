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

				function increaseUserVote(sessionid,userId) {
					var userRef = new Firebase('https://barcamp.firebaseio.com/Users');
					var uidRef = userRef.child(userId);
					uidRef.once('value', function (snapshot) {
						if (snapshot.val().Votes) {
							uidRef.transaction(function (data) {
								data.Votes.push(sessionid);
								return data;
							});
						} else {
							uidRef.set({'Votes':[sessionid]});
						}
					});
				}

				return {
					list: function () {},

					increaseVote: function (session, userId) {
						var childRef = createReference(session.id);
						increaseUserVote(session.id,userId);
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
			'angularFireAuth', '$http', 'webStorage', '$q',
			function (angularFireAuth, $http, webStorage, $q) {
				//webStorage.order = ['session','memory'];
				var token = webStorage.get('user'),
					pendingReady = $q.defer();
				function onAuthResponse(response) {
					var token = response.data;
					webStorage.add('user', token);
					return angularFireAuth.login(response.data);
				}

				var ref = new Firebase('https://barcamp.firebaseio.com/'),
					api = {
						login: function (id) {
							return $http.post('/login', { id: id })
								.then(onAuthResponse);
						},

						ready: pendingReady.promise,

						logout: function () {
							angularFireAuth.logout();
							webStorage.remove('user');
						}
					};

				angularFireAuth.initialize(ref, {
					scope: api,
					name: "user",
					callback: function (err, user) {
						if (err) {
							pendingReady.reject(err);

						} else {
							pendingReady.resolve(user);

						}
					}
				});

				if (token) {
					angularFireAuth.login(token);
				}

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



