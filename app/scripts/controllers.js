(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		BarcampController: function ($scope, angularFireAuth) {},

		SigninController: function ($scope, AuthService, $location) {
			var ref = new Firebase('https://barcamp.firebaseio.com/');

			$scope.authCallback = function (error, user) {
				if (error) {
					console.log('error: ' + error.code);
				} else if (user) {
					localStorage.setItem('token', user.firebaseAuthToken);
					$scope.isLoggedIn = true;
					$scope.userid = user.id;

					$scope.userRef = ref.child('Users').child(id);
					$scope.userRef.once('value', function (data) {
						var val = data.val();
						var info = {
							userId: user.id,
							valid: data.valid
						};
						if (val) {
							info = val;
						}
						$scope.userRef.set(info);

						$location.path('/sessions');
					});
				} else {
					localStorage.clear();
					$scope.isLoggedIn = false;
					$location.path('/');
				}
			};

			$scope.login = function(provider) {
				$scope.token = localStorage.getItem('token');
				var options = {
					'rememberMe': true
				};
				provider = 'anonymous';

				if ($scope.token) {
					console.log('login with token', $scope.token);
					fireFactory.firebaseRef('users').auth($scope.token, $scope.authCallback);
				} else {
					console.log('login with authClient');
					authClient.login(provider, options);
				}
			};

			$scope.logout = function() {
				localStorage.clear();
				authClient.logout();
				$location.path('/');
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

		SessionListingController: function ($scope, $location, User) {

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
