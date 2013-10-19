(function (angular) {
	'use strict';

	var app = angular.module('application.main');

	app.controller({
		ItemsController: function ($scope, items, $http) {
			$scope.model.items = items;

			$scope.vote = function(id){
				$http.post('/api/vote/'+id)
					.success(function(data){ })
					.error(function(data){ });
			};
		}
	});
}(angular));