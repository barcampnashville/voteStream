Application.main.controller('HeaderController', ['$scope', 'Config', '$rootScope', 'VoteService', '$location', HeaderController]);
function HeaderController ( $scope, Config, $rootScope, VoteService, $location ) {
	$scope.model = {
		remaining : 0
	};
      console.log('foo');
	$rootScope.$on('votesRemaining', function(event, val){
		$scope.model.remaining = val;

    if(val == 0){
      $location.path('/results');
    }
	});

	$scope.logo = Config.logo;
}
