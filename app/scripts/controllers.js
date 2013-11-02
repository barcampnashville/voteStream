(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		BarcampController: function ($scope, $location, AuthService) {
			var lastPath;

			$scope.logout = AuthService.logout;

			$scope.$on("$routeChangeStart", function(evt, next, current) {
				// User navigating
				if (!AuthService.user && !(next && next.$$route && next.$$route.allowAnonymousAccess)) {
					lastPath = next && next.path;
					evt.preventDefault();
					$location.path('/login');
				}
			});

			$scope.$on("angularFireAuth:login", function(evt, user) {
				// return to the attempted authenticated location
				$scope.user = user;
				lastPath = '';
				$location.path(lastPath || '/sessions');
			});

			$scope.$on("angularFireAuth:logout", function(evt, user) {
				// User logged out.
				$location.path('/login');
			});

			$scope.$on("angularFireAuth:error", function(evt, err) {
				// There was an error during authentication.
				$location.path('/login');
			});

			var pollingStateRef = new Firebase('https://barcamp.firebaseio.com/PollingState');
			pollingStateRef.on('value', function(snapshot) {
				$scope.pollingIsActive = snapshot.val();
			});

		},

		SigninController: function ($scope, AuthService) {

			AuthService.logout();


			$scope.login = function (id) {
				$scope.thinking = true;
				$scope.error = null;
				AuthService.login(id)
					.then(
						function () {
							$scope.thinking = false;
							// expect redirect now
						},
						function (error) {
							$scope.thinking = false;
							$scope.error = error;
						}
					);
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

		ScheduleController: function ($scope) {
			var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');

			SessionsRef.on('value', function (snapshot) {
				$scope.$apply(function () {
					$scope.sessions = snapshot.val();
				});
			});

			$scope.inRoom = function (item) {
				return item.Room ? item.Room.length > 0 : false;
			};
		},

		SessionListingController: function ($scope) {
			var sessionList;

			var userRef = new Firebase('https://barcamp.firebaseio.com/Users');
			userRef.child($scope.user.d.id).child('Votes').on('value', function (snapshot) {
				console.log(snapshot.val());
			});

			$scope.votesRemaining = 4;

			var morningCutoff = new Date(2013, 10, 2, 10);

			if (!$scope.sessions) {
				var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
				SessionsRef.once('value', function (snapshot) {
					$scope.$apply(function () {
						$scope.sessions = snapshot.val();
					});
				});
			}

			if (morningCutoff.valueOf() > Date.now()) {
				sessionList = 'Morning';
			} else {
				sessionList = 'Afternoon';
			}

			$scope.sessionFilter = {
				Availability: sessionList
			};

			$scope.$on('upVote', function () {
				$scope.votesRemaining -= 1;
			});

			$scope.$on('downVote', function () {
				$scope.votesRemaining += 1;
			});
			console.log($scope.user.d);
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
				$scope.castlot.vote = false;
				$scope.$emit('downVote');
				SessionService.decreaseVote(session);
			};
		}
	});

}(window.angular));
