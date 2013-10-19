Application.config = {
	logo: 'images/logo_hn4.png',
	votes: 0
}

angular.module('application.main')

.factory('Config', function($http, $rootScope){
	$http.get('/api/info')
		.success(function(data){
			Application.config.votes = data.votes;
			$rootScope.$broadcast('numVotesLoaded', data.votes);
		})
		.error();
	return Application.config;
})
