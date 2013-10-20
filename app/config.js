Application.config = {
	logo: 'images/logo_hn4.png',
	votes: 0
}

angular.module('application.main')

.factory('Config', function($http, $rootScope){
	$http.get('/api/info')
		.success(function(data){
            console.log(data);
			Application.config.votes = data.votes;
            Application.config.voterinfo = data.voterinfo;
			$rootScope.$broadcast('numVotesLoaded', data.votes);
			$rootScope.$broadcast('myVotes', data.myvotes);
		})
		.error();
	return Application.config;
})
