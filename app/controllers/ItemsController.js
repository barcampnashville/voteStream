Application.main.controller('ItemsController', ['$scope', '$rootScope', 'items', 'VoteService', 'Sockets', ItemsController]);
function ItemsController( $scope, $rootScope, items, VoteService, Sockets ) {
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
    VoteService.setDetails($scope.name, $scope.email);
    $scope.details = true;
  }

  Sockets.on('voteable added', function(data){
    $scope.items.push(data);
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
