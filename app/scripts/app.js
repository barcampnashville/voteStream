'use strict';

const app = angular.module('BarcampApp', ['ngRoute'])

.config([ '$routeProvider', '$httpProvider', function($routeProvider, $locationProvider) {

	// Initialize Firebase
	firebase.initializeApp({
		apiKey: "AIzaSyDTq31jc44cEWcM4u0PDXouqVfwP5SNiFw",
		authDomain: "nashvillebarcamp.firebaseapp.com",
		databaseURL: "https://nashvillebarcamp.firebaseio.com",
		projectId: "firebase-nashvillebarcamp",
		storageBucket: "firebase-nashvillebarcamp.appspot.com",
		messagingSenderId: "248645383569"
	});

	$routeProvider
		// .when('/', {
		// 	templateUrl : '/templates/home.html',
		// })
	.when('/admin', {
		templateUrl : '/templates/admin.html',
		controller : 'AdminCtrl',
		adminAccess: true,
		resolve: {
			Sessions: function (SessionListing) {
				return SessionListing();
			}
		}
	})
	.when('/fullschedule', {
		templateUrl : '/templates/fullschedule.html',
		controller : 'FullScheduleCtrl',
		// adminAccess: true,
		// resolve: {
		// 	Sessions: function (SessionListing) {
		// 		return SessionListing();
		// 	}
		// }
	})
	.when('/sessions', {
		templateUrl: '/templates/sessionlist.html',
		controller: 'SessionListingCtrl',
		resolve: {
			AuthUser: function(User, $location) {
				return User.getUser().catch(err => {
					$location.path('/login');
				});
			}
		}
	}).when('/login', {
		templateUrl : '/templates/signin.html',
		controller : 'SigninCtrl',
		allowAnonymousAccess:true
	})
	.when('/logout', {
		redirectTo:'/login',
		allowAnonymousAccess:true
	})
	.otherwise({
		redirectTo:'/login'
	});

}])

.run(function ($rootScope, $location) {

});
