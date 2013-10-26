Application.main.controller('ItemsController', ['$scope', '$rootScope', 'items', 'VoteService', 'Sockets', ItemsController]);
function ItemsController( $scope, $rootScope, items, VoteService, Sockets ) {
  if(items.length == 0){
    $rootScope.loading = false;
  }

  $scope.details = false;

  $scope.model.items = shuffle(items);

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
    $scope.invalid = !VoteService.setDetails($scope.name, $scope.email, $scope.voting_id);
    $scope.details = !$scope.invalid;
  }

  Sockets.on('voteable added', function(data){
    console.log('adding voteable', data);
    console.log($scope.model.items.length);
    $scope.model.items.push(data);
    console.log($scope.model.items.length);
    $scope.$apply();
  });
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
