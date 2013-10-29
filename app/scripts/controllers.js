(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		SigninController: function ($scope) {
			$scope.user = {
				email: 'user@barcamp.com',
				badgeId: ''
			};

			$scope.submitDetails = function () {};
		},

		AdminController: function($scope, angularFire) {
			var ref = new Firebase('https://barcamp.firebaseio.com/Sessions');
			scope.sessions = [];
			angularFire(ref, $scope, 'sessions');
		},	

		SessionListingController: function ($scope) {
			$scope.votesRemaining = 4;
			$scope.mysessionlist = [];

			var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
			SessionsRef.once('value', function (snapshot) {
				$scope.sessions = snapshot.val();
				$scope.$apply();
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
