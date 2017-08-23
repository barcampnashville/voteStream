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
  var scheduleTemplate = {
      "morning_sessions": {
      "rooms": []  
    },
    "afternoon_sessions": {
      "rooms": []
    }
  };

  let buildScheduleTemplate = () => {
    angular.forEach($scope.rooms, function(room, key){
      let roomObject = {};
      roomObject["name"] = room;
      roomObject["times"] = {};
      scheduleTemplate.morning_sessions.rooms[key] = roomObject;
      scheduleTemplate.afternoon_sessions.rooms[key] = roomObject;
      angular.forEach($scope.times, function(time, key2){
        let timeObject = {};
        timeObject["time"] = time;
        timeObject["session"] = {
          "title" : "",
          "speaker" : "",
          "url" : ""
        };
        scheduleTemplate.morning_sessions.rooms[key].times[key2] = timeObject;
        scheduleTemplate.afternoon_sessions.rooms[key].times[key2] = timeObject;
      });
    });
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
    let i = 0;
      angular.forEach(SessionListings, function(value, key){
        SessionListings[i].Rank = i+1;
        i++;
      });
    $scope.sessions = SessionListings;
  }
  $scope.addSessionRankingByVotes();

  $scope.setTime = (e, session) => {
    session.Times = e;
  }
  $scope.setRoom = (e, session) => {
    session.Room = e;
  }
  $scope.prepareSchedule = (//scheduleBlock**//
    ) => {
    let morningSchedule = scheduleTemplate.morning_sessions;
    let afternoonSchedule = scheduleTemplate.afternoon_sessions;
    // Table saves time slot and room to the sessions object, matching the properties in sessions to the properties in the morning or afternoon schedule
    angular.forEach($scope.sessions, function(session, key){
      angular.forEach(morningSchedule.rooms, function(room, key){
        if (session.Room === room.name){
          console.log(room)
          angular.forEach(room.times, function(timeSlot, key){
            if (session.Times === timeSlot.time){
              timeSlot.session.speaker = session['First Name'] + " " + session['Last Name'];
              timeSlot.session.title = session.Title;
              //to do
              //timeSlot.session.url = ;
            }
          })
        }
      })

    });

  }
  $scope.checkForConflicts = () => {
  }

});
