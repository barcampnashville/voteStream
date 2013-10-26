(function (angular) {
	'use strict';

	var app = angular.module('application',['ngRoute','application.main']);

	app.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl : '/templates/items/items.html',
					controller : 'ItemsController',
					resolve : {
						items: ['$http', function($http) {
							return $http.get('/api/items').then(function(result) {
									return result.data;
							});
						}]
					}
				})
				.when('/items/new', {
					templateUrl : '/templates/items/new-item.html',
					controller : 'NewItemController'
				})
				.when('/results', {
					templateUrl : '/templates/results/results.html',
					controller : 'ResultsController',
					resolve : {
								voteables: ['$http', function($http) {
									return $http.get('/api/items').then(function(result) {
											return result.data;
									});
								}]
					}
				})
				.when('/createids', {
					templateUrl: '/templates/ids.html',
					controller: 'IDController'
				})
				.when('/error', {
					templateUrl : '/templates/errors/error.html'
				})
				.otherwise({
					templateUrl : '/templates/errors/error.html'
				});
		}
	]);
}(window.angular));