Application.main.factory('VoteService', ['Config', '$http', '$rootScope', VoteService]);
function VoteService ( Config , $http, $rootScope ) {
	var timesVoted = 0;
	$rootScope.$on('numVotesLoaded', function(event, val){
		console.log('votes loaded');
		console.log('votes remaining', val - timesVoted);
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
