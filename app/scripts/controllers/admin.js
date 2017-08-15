'use strict';

app.controller('AdminCtrl', function ($scope, $filter, SessionList, Polling) {
  // const roomValue = document.getElementsBy
  $scope.unSortedSessionsObject = SessionList;
  $scope.unSortedSessionsArray = [];
  $scope.sessions = [];
  $scope.rooms = ["Room A", "Room Z", "Tardis", "Bunker"];
  $scope.times = ["9:30", "10:30", "11:30"];

  $scope.setTime = (e) => {
   const sessionTime = e;

  }

  $scope.setRoom = (e) => {
    const sessionRoom = e;
  }

  $scope.MakeUnSortedSessionsArray = () => {
    let object = $scope.unSortedSessionsObject;
    angular.forEach(object, function(values, key){
      $scope.unSortedSessionsArray.push(object[key])
    });
  }
  $scope.MakeUnSortedSessionsArray();

  //filter sessions by total_votes
  $scope.addSessionRankingByVotes = () => {
    let SessionListings = $filter('orderBy')($scope.unSortedSessionsArray, 'total_votes', !$scope.reverse);
    SessionListings.shift();
    console.log(SessionListings);
    let i = 0;
      angular.forEach(SessionListings, function(value, key){
        SessionListings[i].Rank = i+1;
        i++;
      });
    $scope.sessions = SessionListings;
    console.log($scope.sessions)

  }
  $scope.addSessionRankingByVotes();

  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;


});
