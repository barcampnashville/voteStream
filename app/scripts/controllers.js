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
					data: 'sessions' ,
					enableColumnResize: true,
					enableRowSelection: true,
					multiSelect: false,
					enableColumnReordering: true,
					enableCellEditOnFocus: true,
					// Sorting syntax does not work :( -Bill Butler
					//sortInfo: { fields: ['total_votes'], direction: 'desc' },
					//showColumnMenu: true,
					//showFilter: true,
					columnDefs: [{field: 'id', displayName: 'ID', enableCellEdit: false, width: '10%'},
								{field: 'Title', displayName: 'Title', enableCellEdit: false, width: '30%'},
								{field: "Username", displayName: 'Username', enableCellEdit: false, width: '10%'},
								{field: 'Room', displayName:'Room', enableCellEdit: true, width: '8%'},
								{field: 'Time', displayName:'Time', enableCellEdit: true, width: '8%'},
								{field: 'Availability', displayName:'Availability', enableCellEdit: true, width: '24%'},
								{field: 'total_votes', displayName:'Votes', enableCellEdit: false, width: '10%'}]
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
