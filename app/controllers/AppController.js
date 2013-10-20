Application.main.controller('AppController', ['$scope', 'Sockets', '$http', AppController]);
function AppController ( $scope, Sockets, $http ) {
  $http.get('/api/check')
      .success(function(data){
        console.log(data);  
      });
	$scope.model = {};
}

