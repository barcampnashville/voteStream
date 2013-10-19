Application.main.controller('AppController', ['$scope', AppController]);
function AppController ( $scope) {
	$scope.model = {};
	var socket = io.connect('ws://localhost:9001');
	socket.on('foo', function(data){
		console.log(data);
	});
}