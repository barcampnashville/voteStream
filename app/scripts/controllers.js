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

			if (AuthService.initializing) {
				AuthService.logout();
			}

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
			var sessionList;

			var userRef = new Firebase('https://barcamp.firebaseio.com/Users');
			userRef.child($scope.user.d.id).child('Votes').on('value', function (snapshot) {
				console.log(snapshot.val());
			});

			$scope.votesRemaining = 4;

			var morningCutoff = new Date(2013, 10, 2, 10);
			// var nowTime = Date.now();
			var nowTime = new Date(2013, 10, 2, 12, 30);
			// ### This line above this is for testing!!
			var startOfFirstPoll = new Date(2013, 10, 2, 8);
			var endOfFirstPoll = new Date(2013, 10, 2, 9, 15);
			var startOfSecondPoll = new Date(2013, 10, 2, 12, 10);
			var endOfSecondPoll = new Date(2013, 10, 2, 13, 30);
			var amOrPm = 'am';
			$scope.isPollingOpen = false;

			//if before 8am on Nov. 2
			if (nowTime < startOfFirstPoll) {
				var firstPollHours = startOfFirstPoll.getHours();
				amOrPm = firstPollHours >= 12 ? 'pm' : 'am';
				$scope.pollingMessage = "Polling has not yet begun. Please check back at " + firstPollHours + " " + amOrPm + ".";
			}
			//else if after 9:15am but before 12:10pm on Nov. 2
			else if (nowTime > endOfFirstPoll && nowTime < startOfSecondPoll) {
				var secondPollHours = startOfSecondPoll.getHours();
				amOrPm = secondPollHours >= 12 ? 'pm' : 'am';
				$scope.pollingMessage = "Polling has not yet begun. Please check back at " + secondPollHours + " " + amOrPm + ".";
			}
			//else if after 1:30pm on Nov. 2
			else if (nowTime > endOfSecondPoll) {
				$scope.pollingMessage = "Polling has concluded. Please read about the sessions below, or view the schedule.";
			}
			else {
				$scope.isPollingOpen = true;
			}

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
				$scope.castlot.vote = true;
				$scope.$emit('upVote');
				SessionService.increaseVote(session, $scope.user.d.id);
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
