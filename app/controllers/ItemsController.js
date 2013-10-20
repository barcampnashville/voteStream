Application.main.controller('ItemsController', ['$scope', '$rootScope', 'items', 'VoteService', ItemsController]);
function ItemsController( $scope, $rootScope, items, VoteService ) {
  $scope.details = false;
  $scope.model.items = items;

  $scope.votes = VoteService.myVotes;

  $scope.votedForThis = function(item){
    for(var i=0;i<$scope.votes.length;i++){
      if(item['id'] == $scope.votes[i]){
          return true;
      }
    }
    return false;
  }

  $scope.itemsLoaded = function(){
    console.log('loaded items');
    $rootScope.loading = false;
  };

  if(VoteService.checkDetails()){
    $scope.details = true;
  }

	$scope.vote = function(item){
    if(VoteService.checkDetails()){
      VoteService.vote(item.id);
      item.voted = true;
    } else {
      alert('You must submit your voter details first!');
    }
	}

  $scope.submitDetails = function(){
    VoteService.setDetails($scope.name, $scope.email);
    $scope.details = true;
  }


}
