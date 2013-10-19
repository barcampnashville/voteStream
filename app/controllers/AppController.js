Application.main.controller('AppController', ['$scope', 'Sockets', AppController]);
function AppController ( $scope, Sockets ) {
	$scope.model = {};
	Sockets.on('foo', function(data){
		console.log(data);
	});
}

