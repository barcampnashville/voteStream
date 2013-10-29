(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		AppController: function ($scope) {},

		SigninController: function ($scope) {
			$scope.user = {
				email: 'user@barcamp.com',
				badgeId: ''
			};

			$scope.submitDetails = function () {
				// $scope.user = VoteService.checkDetails();
				console.log($scope.user);
			};
		},

		/*ItemsController: function ($scope, $rootScope, items, VoteService, Sockets) {
			$scope.model.items = shuffle(items);

			$scope.votes = VoteService.myVotes;

			$scope.votedForThis = function(item){
				for(var i=0;i<$scope.votes.length;i++){
					if(item['id'] == $scope.votes[i]){
						return true;
					}
				}
				return false;
			};

			$scope.submitDetails = function(){
				$scope.invalid = !VoteService.setDetails($scope.voting_id);
				$scope.details = !$scope.invalid;
			};

			Sockets.on('voteable added', function(data){
				$scope.model.items.push(data);
				$scope.$apply();
			});

			function shuffle(array) {
				var currentIndex = array.length,
					temporaryValue,
					randomIndex;

			// While there remain elements to shuffle...
				while (0 !== currentIndex) {

					// Pick a remaining element...
					randomIndex = Math.floor(Math.random() * currentIndex);
					currentIndex -= 1;

					// And swap it with the current element.
					temporaryValue = array[currentIndex];
					array[currentIndex] = array[randomIndex];
					array[randomIndex] = temporaryValue;
				}

				return array;
			}
		},

		NewItemController: function ($scope, $http, $timeout) {
			$scope.submitItem = function() {

				var people = [];

				$scope.people.split(',').forEach(function(name) {
					people.push(capitaliseFirstLetters(name.trim()));
				});

				var data = {
					"id": $scope.title,
					"title": $scope.title,
					"people": people,
					"description": $scope.description
				};

				$http.post('/api/items/new', data)
					.success(function(data) {
						$scope.created = true;

						$timeout(function() {
							window.location = '/';
						}, 4000);

					})
				.error(function(data) {});

				function capitaliseFirstLetters(string) {
					var result = [];

					string.split(' ').forEach(function(name) {
						result.push(capitaliseFirstLetter(name));
					});

					return result.join(' ');

					function capitaliseFirstLetter(string) {
						return string.charAt(0).toUpperCase() + string.slice(1);
					}
				}

			};
		},

		IDController: function ($scope, $http) {
			$scope.createIDs = function(user) {
				if (user.password === 'abc') {
					window.location = 'api/create_valid_ids';
					// $http.get('api/create_valid_ids');
				} else {

					alert("Wrong passcode");
				}
			};
		},

		ResultsController: function ($scope, $http, Sockets, voteables) {
			function draw(data){
				var el = document.getElementById('chart'),
					ael = angular.element(el)[0],
					width = ael.offsetParent.clientWidth - (ael.offsetLeft * 2),
					height = (window.innerHeight - ael.offsetTop),
					ctx = el.getContext('2d'),
					chartLabels = [],
					chartData = [],
					pieData = [],
					greatest = 0;

				ael.setAttribute('width', width);
				ael.setAttribute('height', height);

				for(var i=0;i<data.length;i++){
					chartLabels.push(data[i]['_id']);
					chartData.push(data[i]['count']);

					if(data[i]['count'] > greatest) {
						greatest = data[i]['count'];
					}

					pieData.push({value: data[i]['count'], color: get_random_rgb()});
				}

				data = {
					labels : chartLabels,
					datasets : [{fillColor:"rgba(151,187,205,0.5)", strokeColor:"rgba(151,187,205,1)", data:chartData}]
				};

				var steps = 3,
					opts = {
						scaleShowGridLines: false,
						scaleOverride: true,
						scaleSteps: steps,
						scaleStepWidth: Math.ceil(greatest / steps),
						scaleStartValue: 0,
						animation: false
					};

				new Chart(ctx).Bar(data, opts);
				//new Chart(ctx).Pie(pieData, opts);
			}

			$http.get('/api/results')
				.success(function(data){
					if(data.length > 0){
						draw(data);
					}
				})
				.error(function(data){
				});

			Sockets.on('vote cast', function(data) {
				draw(data);
			});

			$scope.model = {items: []};

			for(var i = 0;i<voteables.length;i++){
				$scope.model.items.push({title: voteables[i].title, color: rgb(voteables[i].color)});
			}
		},
*/
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
