Application.main.controller('AppController', ['$rootScope', '$scope', 'Sockets', '$http', AppController]);
function AppController ( $rootScope, $scope, Sockets, $http ) {
  $rootScope.loading = true;

  $http.get('/api/check')
      .success(function(data){
        console.log(data);  
      });
	$scope.model = {};
}

