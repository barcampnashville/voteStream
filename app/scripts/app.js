(function (angular) {
	'use strict';

	var app = angular.module('BarcampApp',['ngRoute','firebase','ngGrid', 'truncate']);

	app.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninController'
				})
				.when('/results', {
					templateUrl : '/templates/results.html',
					controller : 'ResultsController'
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingController'
				})
                .when('/rooms', {
                    templateUrl: '/templates/rooms.html',
                    controller: 'SessionListingController'
                }).
				when('/sessions/:sessionId', {
					templateUrl: 'templates/sessiondetail.html',
					controller: 'SessionDetailController'
				});
		}
	]);

	//source: https://github.com/sparkalow/angular-truncate
	angular.module('truncate', [])
    .filter('characters', function () {
        return function (input, chars, breakOnWord) {
            if (isNaN(chars)) return input;
            if (chars <= 0) return '';
            if (input && input.length >= chars) {
                input = input.substring(0, chars);

                if (!breakOnWord) {
                    var lastspace = input.lastIndexOf(' ');
                    //get last space
                    if (lastspace !== -1) {
                        input = input.substr(0, lastspace);
                    }
                }else{
                    while(input.charAt(input.length-1) == ' '){
                        input = input.substr(0, input.length -1);
                    }
                }
                return input + '...';
            }
            return input;
        };
    })
    .filter('words', function () {
        return function (input, words) {
            if (isNaN(words)) return input;
            if (words <= 0) return '';
            if (input) {
                var inputWords = input.split(/\s+/);
                if (inputWords.length > words) {
                    input = inputWords.slice(0, words).join(' ') + '...';
                }
            }
            return input;
        };
    });
}(window.angular));