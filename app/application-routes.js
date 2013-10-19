function setupRoutes ( $routeProvider, $locationProvider, $httpProvider ) {
  $locationProvider.html5Mode(true);

  //$httpProvider.responseInterceptors.push('$errorInterceptor');
  
  $routeProvider.when('/items', {
    templateUrl : '/app/templates/items/items.html',
    controller : 'ItemsController',
    //resolve : {project:Application.ProjectResolver, state:echo('editor')}
  });

  //**************************
  // Error Pages
  //**************************

  $routeProvider.when('/error', {
    templateUrl : '/app/templates/errors/error.html'
  });

  //************************
  // Catch all
  //************************

  $routeProvider.otherwise({
    templateUrl : '/app/templates/errors/error.html'
  });

}

var module = angular.module('application', [
  'ngRoute',
  'application.main'
]);

module.config([
  '$routeProvider',
  '$locationProvider',
  '$httpProvider',
  setupRoutes
]);

function echo ( token ) {
  return function() { return token; };
}
