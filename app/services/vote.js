Application.main.factory('VoteService', ['Config', '$http', '$rootScope', VoteService]);
function VoteService ( Config , $http, $rootScope ) {
	var timesVoted = 0;
	var myVotes = [];
	var votesAvailable = 0;

	$rootScope.$on('myVotes', function(event, val){
		timesVoted = timesVoted + val.length;
		if( (timesVoted >= votesAvailable) && timesVoted != 0){
			console.log('foo');
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
			console.log(timesVoted, Config.votes);
			if(timesVoted < Config.votes){
				$http.post('/api/vote/'+id)
					.success(function(data){
						console.log('success!', data);
						console.log(timesVoted);
						timesVoted = timesVoted + 1;
						$rootScope.$broadcast('votesRemaining', Config.votes - timesVoted);
						if(timesVoted >= votesAvailable){
							$rootScope.noVotes = true;
						}
					})
					.error(function(data){
						console.log('error', data);
					});
			} else {
				alert("You can't vote anymore!");
			}
		}
	}
};
