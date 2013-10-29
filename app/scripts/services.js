(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.factory({

		SessionService: [
			'$http',
			function ($http) {
				var ref = new Firebase('https://barcamp.firebaseio.com/Sessions/'),
				// object to store all references
				sessionRef = {};

				// Returns the Firebase reference for given Session ID
				function createReference (id) {
					if (!sessionRef.hasOwnProperty(id)) {
						sessionRef[id] = ref.child(id);
					}
					return sessionRef[id];
				}

				return {
					list: function () {},

					increaseVote: function (session) {
						var childRef = new Firebase(ref +'/'+ session.id);
						console.log(childRef);
						childRef.transaction(function (data) {
							data.total_votes += 1;
							return data;
						});
					},

					decreaseVote: function (session) {
						var childRef = createReference(session.id);
						console.log(childRef);
						childRef.transaction(function (data) {
							data.total_votes -= 1;
							return data;
						});
					},

					star: function (id) {},

					unstar: function (id) {}
				};
			}
		],

		VoteService: [
		'Config', '$http', '$rootScope',
		function (Config, $http, $rootScope) {
			var timesVoted = 0;
			var myVotes = [];
			var votesAvailable = 0;
			var authGiven;
			var voterDetails = false;

			$rootScope.$on('myVotes', function(event, val){
				for(var i=0;i<val.length;i++){
					myVotes.push(val[i]['vote']);
				}
				timesVoted = timesVoted + val.length;
				if( (timesVoted >= votesAvailable) && timesVoted !== 0){
					$rootScope.noVotes = true;
				}
				$rootScope.$broadcast('votesRemaining', votesAvailable - timesVoted);
			});

			$rootScope.$on('numVotesLoaded', function(event, val){
				votesAvailable = val;
				$rootScope.$broadcast('votesRemaining', val - timesVoted);
			});

			return {
				vote: function(id){
					if(timesVoted < Config.votes){
						data = voterDetails;
						$http.post('/api/vote/'+id, data)
							.success(function(data){
								timesVoted = timesVoted + 1;
								$rootScope.$broadcast('votesRemaining', Config.votes - timesVoted);
								if(timesVoted >= votesAvailable){
									$rootScope.noVotes = true;
								}
							})
							.error(function(data){
							});
					} else {
						alert("You can't vote anymore!");
					}
				},
				checkDetails: function(){
					if(Config.voterinfo){
						voterDetails = Config.voterinfo;
					}

					if(!voterDetails){
						return false;
					}

					return true;
				},
				setDetails: function(voting_id) {
					voterDetails = {voting_id: voting_id};

					//check if the id is valid.
					var valid = false;


					if (valid) {
						$http.post('/api/voterdetails', voterDetails);
						return true;
					} else {
						return false;
					}
				},
				myVotes: myVotes
			};
		}]
	});
}(window.angular));



