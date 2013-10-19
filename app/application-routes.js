function setupRoutes ( $routeProvider, $locationProvider ) {
	//console.log('app config:', ApplicationConfig);
  $locationProvider.html5Mode(true);

  //$httpProvider.responseInterceptors.push('$errorInterceptor');
  
  $routeProvider.when('/', {
    templateUrl : '/templates/items/items.html',
    controller : 'ItemsController',
    resolve : {
      /*items: ['$http', function($http) {
        return $http.get('/api/items').then(function(result) { return result.data; });
      }]*/
	    items: function(){ return Application.config.voteables;}
    }
  });

	$routeProvider.when('/results', {
		templateUrl : '/templates/results/items.html',
		controller : 'ResultsController',
		resolve : {
			/*items: ['$http', function($http) {
			 return $http.get('/api/items').then(function(result) { return result.data; });
			 }]*/
			items: function(){ return Application.config.voteables;}
		}
	});

	//**************************
  // Error Pages
  //**************************

  $routeProvider.when('/error', {
    templateUrl : '/templates/errors/error.html'
  });

  //************************
  // Catch all
  //************************

  $routeProvider.otherwise({
    templateUrl : '/templates/errors/error.html'
  });

}

var module = angular.module('application', [
  'ngRoute',
  'application.main'
]);

module.config([
  '$routeProvider',
  '$locationProvider',
  setupRoutes
]);

function echo ( token ) {
  return function() { return token; };
}
