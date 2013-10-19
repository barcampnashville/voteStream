function setupRoutes ( $routeProvider, $locationProvider, $http ) {
	console.log('app config:', ApplicationConfig);
  $locationProvider.html5Mode(true);

  //$httpProvider.responseInterceptors.push('$errorInterceptor');
  
  $routeProvider.when('/items', {
    templateUrl : '/templates/items/items.html',
    controller : 'ItemsController',
    resolve : {
      items: $http.get('/api/items')
      //project:Application.ProjectResolver,

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
  '$http',
  setupRoutes
]);

function echo ( token ) {
  return function() { return token; };
}
