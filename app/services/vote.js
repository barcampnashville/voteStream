Application.main.factory('VoteService', ['Config', '$http', '$rootScope', VoteService]);
function VoteService ( Config , $http, $rootScope ) {
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
		if( (timesVoted >= votesAvailable) && timesVoted != 0){
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
            if(!voterDetails){
                return false;               
            }

            return true;
        },
        setDetails: function(name, email){
            voterDetails = {name: name, email: email}
        },
        myVotes: myVotes
	}
};
