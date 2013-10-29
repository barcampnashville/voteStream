(function (angular) {
	'use strict';

	var app = angular.module('BarcampApp',['ngRoute','firebase']);

	app.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninController'
				})
				.when('/admin', {
					templateUrl : '/templates/admin.html',
					controller : 'AdminController'
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingController'
				});
		}
	]);
}(window.angular));