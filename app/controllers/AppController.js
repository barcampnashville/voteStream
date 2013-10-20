Application.main.controller('AppController', ['$rootScope', '$scope', 'Sockets', '$http', '$location', AppController]);
function AppController ( $rootScope, $scope, Sockets, $http, $location ) {
  var path = $location.path();
  if(path == '/'){
    $rootScope.loading = true;
  }

  $http.get('/api/check')
      .success(function(data){
        console.log(data);  
      });
	$scope.model = {};
}

