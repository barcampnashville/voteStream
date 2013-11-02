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
				amOrPm = firstPollHours >= 12 ? 'pm' : 'am'
				$scope.pollingMessage = "Polling has not yet begun. Please check back at " + firstPollHours + " " + amOrPm + ".";
			}
			//else if after 9:15am but before 12:10pm on Nov. 2
			else if (nowTime > endOfFirstPoll && nowTime < startOfSecondPoll) {
				var secondPollHours = startOfSecondPoll.getHours();
				amOrPm = secondPollHours >= 12 ? 'pm' : 'am'
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
