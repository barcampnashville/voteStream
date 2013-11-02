(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		BarcampController: function ($scope, angularFireAuth) {},

		SigninController: function ($scope, AuthService) {},

		ResultsController: function($scope, angularFire) {

			var ref = new Firebase('https://barcamp.firebaseio.com/Sessions');

			$scope.sessions = angularFire(ref, $scope, 'sessions');
			$scope.gridOptions = {
				data: 'sessions' ,
				enableColumnResize: true,
				enableRowSelection: true,
				multiSelect: false,
				enableColumnReordering: true,
				enableCellEditOnFocus: true,
				columnDefs: [
					{field: 'id', displayName: 'ID', enableCellEdit: false, width: '10%'},
					{field: 'Title', displayName: 'Title', enableCellEdit: false, width: '30%'},
					{field: "Username", displayName: 'Username', enableCellEdit: false, width: '10%'},
					{field: 'Room', displayName:'Room', enableCellEdit: true, width: '8%'},
					{field: 'Time', displayName:'Time', enableCellEdit: true, width: '8%'},
					{field: 'Availability', displayName:'Availability', enableCellEdit: true, width: '24%'},
					{field: 'total_votes', displayName:'Votes', enableCellEdit: false, width: '10%'}
				]
			};
		},

		SessionListingController: function ($scope, $location) {
			var myVotes = [],
				sessionList;
			$scope.votesRemaining = 4;

			var noon = new Date(2013, 10, 2, 10);

			var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
			SessionsRef.once('value', function (snapshot) {
				$scope.$apply(function () {
					$scope.sessions = snapshot.val();
				});
			});

			if (noon.valueOf() > Date.now()) {
				sessionList = 'Morning';
			} else {
				sessionList = 'Afternoon';
			}

			$scope.sessionFilter = {
				Availability: sessionList,
				Room: ''
			};

			$scope.$on('upVote', function () {
				$scope.votesRemaining -= 1;
			});

			$scope.$on('downVote', function () {
				$scope.votesRemaining += 1;
			});
		},

		SessionDetailController: function($scope, $location) {
			$scope.sessionId = $routeParams.sessionId;
		},

		SessionController: function ($scope, SessionService) {
			$scope.castlot = {vote: false};

			$scope.upVote = function (session) {
				if ($scope.votesRemaining === 0) {
					return;
				}
				$scope.castlot.vote = true;
				$scope.$emit('upVote');
				SessionService.increaseVote(session);

			};

			$scope.downVote = function (session) {
				if ($scope.votesRemaining > 4) {
					return;
				}
				$scope.castLot.voted = false;
				$scope.$emit('downVote');
				SessionService.decreaseVote(session);
			};
		}
	});

}(window.angular));
