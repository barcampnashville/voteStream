function setupRoutes ( $routeProvider, $locationProvider ) {
  $locationProvider.html5Mode(true);

  //$httpProvider.responseInterceptors.push('$errorInterceptor');
  
  $routeProvider.when('/', {
    templateUrl : '/templates/items/items.html',
    controller : 'ItemsController',
    resolve : {
	    items: function(){ return Application.config.voteables;}
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
  setupRoutes
]);

function echo ( token ) {
  return function() { return token; };
}
