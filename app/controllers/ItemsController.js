Application.main.controller('ItemsController', ['$scope', 'items', 'VoteService', ItemsController]);
function ItemsController( $scope, items, VoteService ) {
  $scope.model.items = items;

	$scope.vote = function(item){
		VoteService.vote(item.id);
		item.voted = true;
	}
}
