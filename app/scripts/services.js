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
			function () {
				var barcampRef = new Firebase('https://barcamp.firebaseio.com/');

				function signIn (id) {
					var auth,
						validId = true;
					if (validId) {
						auth = new FirebaseSimpleLogin(barcampRef, function (err, user) {
							if (err) {
								console.log(err);
							} else {
								return user;
							}
						});
					}
					return auth;
				}

				return {
					login: function (id) {
						var auth = signIn(id);
						auth.login('anonymous');
					},

					logout: function () {}
				};
			}
		]
	});
}(window.angular));



