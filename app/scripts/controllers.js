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
			pollingStateRef.on('value', function (snapshot) {
				$scope.pollingIsActive = snapshot.val();
				if (!$scope.$$phase) {
					$scope.$apply();
				}
			});
		},

		SigninController: function ($scope, AuthService) {

			if (AuthService.initializing) {
				AuthService.logout();
			}

			$scope.$watch('badgeId', function () {
				$scope.error = null;
			});

			$scope.login = function (id) {
				$scope.thinking = true;
				$scope.error = null;
				AuthService.login(id)
					.then(
						function () {
							$scope.thinking = false;
							// expect redirect now
						},
						function (response) {
							$scope.thinking = false;
							$scope.error = response.status == 401 ? "I have no memory of this ID" : "I'm afraid I can't do that, Dave.";
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

			var pollingStateRef = new Firebase('https://barcamp.firebaseio.com/PollingState');
			$scope.$watch("pollingIsActive", function (newValue) {
				pollingStateRef.set(newValue);
			});
		},

		ScheduleController: function ($scope) {
			var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');

			SessionsRef.on('value', function (snapshot) {
				$scope.sessions = snapshot.val();
				if (!$scope.$$phase) {
					$scope.$apply();
				}

			});

			$scope.inRoom = function (item) {
				return item.Room ? item.Room.length > 0 : false;
			};
		},

		SessionListingController: function ($scope) {
			$scope.myList = [];
			var sessionList;

			var userRef = new Firebase('https://barcamp.firebaseio.com/Users');

			userRef.child($scope.user.d.id).child('voteCounts').on('value', function (snapshot) {
				$scope.votesRemaining = 4 - (snapshot.val() || 0);
			});

			var morningCutoff = new Date(2013, 10, 2, 10);

			if (!$scope.sessions) {
				var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
				SessionsRef.once('value', function (snapshot) {
					$scope.sessions = snapshot.val();
					if (!$scope.$$phase) {
						$scope.$apply();
					}
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


		},

		SessionController: function ($scope, SessionService) {
			$scope.castlot = {vote: false};

			$scope.upVote = function (session) {
				if ($scope.votesRemaining === 0) {
					return;
				}
				SessionService.increaseVote(session, $scope.user.d.id);
				$scope.$emit('upVote');
				$scope.castlot.vote = true;
				$scope.myList.push(session);
			};

			$scope.downVote = function (session) {
				if ($scope.votesRemaining > 4) {
					return;
				}
				$scope.castlot.vote = false;
				$scope.$emit('downVote');
				SessionService.decreaseVote(session, $scope.user.d.id);
				$scope.myList.splice($scope.myList.indexOf(session), 1);
			};
		}
	});

}(window.angular));
