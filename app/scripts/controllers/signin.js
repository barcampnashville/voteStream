'use strict';

app.controller('SigninCtrl', function ($scope,$route, $location,AuthService) {

	AuthService.getAllUsers().then((userList)=>{
		$scope.badges = userList;
		// console.log($scope.badges);
	});

	$scope.$watch('badgeId', function () {
      $scope.error = null;
  });

  $scope.login = (id) => {
  	Object.keys($scope.badges).forEach((badge)=>{
  		if ($scope.badgeId.toUpperCase() === badge){
  			$location.path('/#!/sessions');
  		};
  	});
 	};

});
