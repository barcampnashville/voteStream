Application.main.controller('ItemsController', ['$scope', 'items', '$http', ItemsController]);
function ItemsController( $scope, items, $http ) {
	console.log(items);
  $scope.model.items = items;

	$scope.vote = function(id){
		console.log('voting for item '+id);
		$http.post('/api/vote/'+id)
			.success(function(data){
				console.log('success!', data);
			})
			.error(function(data){
				console.log('error', data);
			});
	}
}
