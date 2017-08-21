'use strict';

app.controller('AdminCtrl', function ($scope, $filter, SessionList, Polling) {
  // const roomValue = document.getElementsBy
  $scope.unSortedSessionsObject = SessionList;
  $scope.unSortedSessionsArray = [];
  $scope.sessions = [];
  $scope.rooms = ["Room A", "Room Z", "Tardis", "Bunker"];
  $scope.times = ["9:30", "10:30", "11:30"];
  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;
  var unsavedSchedule = {
      "morning_sessions": {
      "rooms": [
       {
        "name": "",
        "times": [
          {
            "time": "",
            "session": {
              "title": "",
              "speaker": "",
              "url": ""
            }
          }
        ] 
       }
      ]  
    },
    "afternoon_sessions": {
      "rooms": [
       {
        "name": "",
        "times": [
          {
           "time": "",
           "session": {
            "title": "",
            "speaker": "",
            "url": ""
           } 
          }
        ] 
       }
      ] 
    }
  };

  let buildScheduleTemplate = () => {
    unsavedSchedule.morning_sessions.rooms[0].name = $scope.rooms[0];
    angular.forEach($scope.rooms, function(room, key){
      if (!unsavedSchedule.morning_sessions.rooms[key]){
        let obj = {};
        obj["name"] = room;
        unsavedSchedule.morning_sessions.rooms.push(obj);
      }
        console.log(unsavedSchedule.morning_sessions)
      // unsavedSchedule.morning_sessions.rooms[key].name = room;
    })
  }
  buildScheduleTemplate();

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
    // console.log(SessionListings);
    let i = 0;
      angular.forEach(SessionListings, function(value, key){
        SessionListings[i].Rank = i+1;
        i++;
      });
    $scope.sessions = SessionListings;
    // console.log($scope.sessions)

  }
  $scope.addSessionRankingByVotes();



  $scope.setTime = (e, session) => {
    session.Times = e;
  }
  $scope.setRoom = (e, session) => {
    session.Room = e;
  }

  $scope.buildScheduleArray = () => {
    angular.forEach($scope.sessions, function(values, key){
      console.log(values.Room)
      $scope.unsavedSchedule.Room = values.Room;
    })
    console.log($scope.unsavedSchedule);
  }

  $scope.checkForConflicts = () => {

  }

});
