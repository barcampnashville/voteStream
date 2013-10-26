(function (angular) {
	'use strict';

	var app = angular.module('ng');

	app.controller({
		AppController: function ($rootScope, $scope, Sockets, $http, $location) {
			var path = $location.path();

			if(path == '/'){
				$rootScope.loading = true;
			}

			$http.get('/api/check')
				.success(function(data){
					console.log(data);
				});
			$scope.model = {};
		},
    IDController: function($scope, $http) {
      $scope.createIDs = function(user) {
        if (user.password == 'abc') {
          window.location = 'api/create_valid_ids';
          // $http.get('api/create_valid_ids');
        } else {
          alert("Wrong passcode");
        }
      }
    }
	});

}(window.angular));
