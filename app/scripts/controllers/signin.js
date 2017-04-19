angular.module('BarcampApp')
	.controller('SigninCtrl', function ($scope,$route, $location,AuthService) {
	    $scope.$watch('badgeId', function () {
	        $scope.error = null;
	    });

	      AuthService.Users().then((database)=>{
	      $scope.badges=database.data.Users
	    })
	      $scope.login=(id)=>{
	        	Object.keys($scope.badges).forEach((badge)=>{
	        		if ($scope.badgeId.toUpperCase() === badge){
	        			console.log("logged in")
	        			$location.path('#!/sessions')
	        			$route.reload()
	        		}
	        	})
	     	 }      
})
