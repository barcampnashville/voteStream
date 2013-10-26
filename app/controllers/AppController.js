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
		}
	});

}(window.angular));
