(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		BarcampController: function ($scope, angularFireAuth) {
			var barcampRef = $scope.barcampRef = new Firebase('https//barcamp.firebaseio.com/');
			angularFireAuth.initialize(barcampRef, {scope: $scope, name: 'user'});
			/*var auth = new FirebaseSimpleLogin(barcampRef, function (error, user) {
				if (error) {
					console.log(error);
				} else if (user) {
					console.log(user);
				}
			});*/
		},

		SigninController: function ($scope, angularFireAuth) {

			$scope.submitDetails = function (id) {
				$scope.barcampRef.child('Users');
				angularFireAuth.login('anonymous');
				console.log($scope.user);
			};
		},

		ResultsController: function($scope, angularFire) {

			var ref = new Firebase('https://barcamp.firebaseio.com/Sessions');
			$scope.sessions = angularFire(ref, $scope, 'sessions');
			$scope.gridOptions = {
				data: 'sessions',
				enableCellSelection: true,
				enableRowSelection: false,
				enableCellEditOnFocus: true,
				sortBy: 'total_votes',
				columnDefs: [
					{field: 'id', displayName: 'ID', enableCellEdit: false, width: '10%', resizable: true},
					{field: 'Title', displayName: 'Title', enableCellEdit: false, width: '40%', resizable: true},
					{field: 'Username', displayName: 'Username', enableCellEdit: true, width: '20%', resizable: true},
					{field:'Room', displayName:'Room', enableCellEdit: true, width: '10%', resizable: true},
					{field:'Time', displayName:'Time', enableCellEdit: true, width: '10%', resizable: true},
					{field:'total_votes', displayName:'Votes', enableCellEdit: true, width: '10%', resizable: true}
				]
			};
		},

		SessionListingController: function ($scope, $location) {

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
