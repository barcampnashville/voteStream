(function (angular) {
	'use strict';

	var app = angular.module('BarcampApp',['ngRoute','firebase','ngGrid','webStorageModule']);

	app.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/results', {
					templateUrl : '/templates/results.html',
					controller : 'ResultsController',
					allowAnonymousAccess:false
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingController',
					allowAnonymousAccess:true
				})
				.when('/schedule', {
					templateUrl: '/templates/schedule.html',
					controller: 'ScheduleController'
				})
				.when('/login', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninController',
					allowAnonymousAccess:true
				})
				.when('/logout', {
					redirectTo:'/login',
					allowAnonymousAccess:true
				})
				.otherwise({
					redirectTo:'/sessions'
				});
		}
	]);
}(window.angular));