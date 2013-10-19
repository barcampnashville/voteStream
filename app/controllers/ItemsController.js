Application.main.controller('ItemsController', ['$scope', 'items', ItemsController]);
function ItemsController( $scope, items ) {
	console.log(items);
  $scope.model.items = items;
}
