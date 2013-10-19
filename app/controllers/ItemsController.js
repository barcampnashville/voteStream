Application.main.controller('ItemsController', ['$scope', 'items', 'VoteService', ItemsController]);
function ItemsController( $scope, items, VoteService ) {
  $scope.model.items = items;

	$scope.vote = function(id){
		VoteService.vote(id);
	}
}
