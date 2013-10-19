Application.main.controller('HeaderController', ['$scope', 'Config', HeaderController]);
function HeaderController ( $scope, Config ) {
	$scope.logo = Config.logo;
}

