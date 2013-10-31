(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		BarcampAppController: function ($scope, angularFireAuth) {
			var ref = $scope.ref = new Firebase("https://barcamp.firebaseio.com/");
			angularFireAuth.initialize(ref, {scope: $scope, name: "user"});
		},

		SigninController: function ($scope, angularFireAuth, AuthService) {
			$scope.submitDetails = function (user) {
				var ref = $scope.ref.child('Users'),
					userRef = ref.child(user.badgeId);

				userRef.on('value', function (snapshot) {
					if (snapshot.val()) {
						angularFireAuth.initialize(ref, {scope: $scope, name:user.badgeId});
					}
				});
			};

			$scope.$on("angularFireAuth:login", function(evt, user) {
				console.log(user);
			});
		},

		ResultsController: function($scope, angularFire) {
			var ref = $scope.ref.child('Sessions');
			$scope.sessions = [];
			angularFire(ref, $scope, 'sessions');
		},

		SessionListingController: function ($scope) {
			$scope.votesRemaining = 4;
			$scope.mysessionlist = [];

			var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
			SessionsRef.once('value', function (snapshot) {
				$scope.$apply(function () {
					$scope.sessions = snapshot.val();
				});
			});

			$scope.sessionFilter = {
				Availability: 'Morning'
			};

			$scope.$on('upVote', function () {
				$scope.votesRemaining -= 1;
			});

			$scope.$on('downVote', function () {
				$scope.votesRemaining += 1;
			});
		},

		SessionController: function ($scope, SessionService) {
			$scope.votes = {voted: false};

			$scope.upVote = function (session) {
				if ($scope.votesRemaining === 0) {
					return;
				}
				$scope.mysessionlist.push(session);
				$scope.votes.voted = true;
				$scope.$emit('upVote');
				SessionService.increaseVote(session);

			};

			$scope.downVote = function (session) {
				if ($scope.votesRemaining > 4) {
					return;
				}
				$scope.mysessionlist.splice($scope.mysessionlist.indexOf(session), 1);
				$scope.votes.voted = false;
				$scope.$emit('downVote');
				SessionService.decreaseVote(session);
			};
		}
	});

}(window.angular));
