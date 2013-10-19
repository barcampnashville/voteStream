Application.main.controller('ItemsController', ['$scope', 'items', ItemsController]);
function ItemsController( $scope, items ) {
  $scope.model.items = items;
}
