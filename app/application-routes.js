function setupRoutes ( $routeProvider, $locationProvider ) {
	//console.log('app config:', ApplicationConfig);
  $locationProvider.html5Mode(true);

  //$httpProvider.responseInterceptors.push('$errorInterceptor');
  
  $routeProvider.when('/', {
    templateUrl : '/templates/items/items.html',
    controller : 'ItemsController',
    resolve : {
      items: ['$http', function($http) {
        return $http.get('/api/items').then(function(result) { 
            return result.data; 
        });
      }]
    }
  });


  $routeProvider.when('/items/new', {
    templateUrl : '/templates/items/new-item.html',
    controller : 'NewItemController'
  });

	$routeProvider.when('/results', {
		templateUrl : '/templates/results/results.html',
		controller : 'ResultsController',
		resolve : {
          voteables: ['$http', function($http) {
            return $http.get('/api/items').then(function(result) { 
                return result.data; 
            });
          }]
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
