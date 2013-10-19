Application.main.controller('HeaderController', ['$scope', 'Config', '$rootScope', 'VoteService', HeaderController]);
function HeaderController ( $scope, Config, $rootScope, VoteService ) {
	$scope.model = {
		remaining : 0
	};

	$rootScope.$on('votesRemaining', function(event, val){
		console.log(val);
		$scope.model.remaining = val;
	});

	$scope.logo = Config.logo;
}

