Application.main.controller('ResultsController', ['$scope', '$http', ResultsController]);
function ResultsController ( $scope, $http ) {
	$http.get('/api/results')
		.success(function(data){
			console.log(data);
		})
		.error(function(data){
			console.log(data);
		});
	$scope.model = {};
}
