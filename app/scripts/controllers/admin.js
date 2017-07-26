'use strict';

app.controller('AdminCtrl', function ($scope, $filter, SessionList, Polling) {
  $scope.unSortedSessions = SessionList;
  $scope.sessions = [];
  //filter sessions by total_votes
  $scope.addSessionRankingByVotes = () => {
    $scope.SessionListings = $filter('orderBy')($scope.unSortedSessions, 'total_votes', !$scope.reverse);
    let i = 0;
      angular.forEach($scope.SessionListings, function(value, key){
        $scope.SessionListings[i].Rank = i+1;
        i++;
      });
    $scope.sessions = $scope.SessionListings;
    console.log($scope.sessions)

  }
  $scope.addSessionRankingByVotes();
  // console.log($scope.sessions)

  


  // $scope.addStackRank = () => {
    
      

  //   })
  // }
  // $scope.addStackRank();


  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;

	// console.log("$scope.sessions-->", $scope.sessions); 
  console.log("$scope.availability -->", $scope.availability);

});
