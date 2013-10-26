(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({

		AppController: function ($scope) {
			$scope.model = {};
		},

		ItemsController: function ($scope, $rootScope, items, VoteService, Sockets) {
			if(items.length === 0) {
				$rootScope.loading = false;
			}

			$scope.details = false;

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

			$scope.itemsLoaded = function(){
				$rootScope.loading = false;
			};

			if(VoteService.checkDetails()){
				$scope.details = true;
			}

			$scope.vote = function(item){
				if(VoteService.checkDetails()){
					VoteService.vote(item.id);
					item.voted = true;
				} else {
					alert('You must submit your voter details first!');
				}
			};

			$scope.submitDetails = function(){
				$scope.invalid = !VoteService.setDetails($scope.name, $scope.email, $scope.voting_id);
				$scope.details = !$scope.invalid;
			};

			Sockets.on('voteable added', function(data){
				console.log('adding voteable', data);
				console.log($scope.model.items.length);
				$scope.model.items.push(data);
				console.log($scope.model.items.length);
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
		}
	});

}(window.angular));
