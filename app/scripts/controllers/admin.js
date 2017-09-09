'use strict';

app.controller('AdminCtrl', function ($scope, $filter, SessionList, Polling, Constants, $http) {

  $scope.unSortedSessionsObject = SessionList;
  $scope.unSortedSessionsArray = [];
  $scope.sessions = [];
  $scope.rooms = ["Room A", "Room Z", "Tardis", "Bunker"];
  $scope.times = ["9:30", "10:30", "11:30"];
  $scope.availability = Polling;
  $scope.sortByType = "rank";
  $scope.reverseSort = false;
  let morningSchedule = {};
  let afternoonSchedule = {};

  let scheduleTemplate = {
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

  let checkForConflicts = (arrayData) => {
    arrayData.sort();
    for (let i = 0; i < arrayData.length -1; i++){
      if(arrayData[i+1][0] === arrayData[i][0]  && arrayData[i+1][1] === arrayData[i][1]){
        alert('There are room and time conflicts. Please fix them before continuing.')
        //todo : highlight table rows where the conflicts are
        return true;
      }
    }
    return false;
  }
  $scope.prepareSchedule = (timeOfDay) => {
    //capitalize first character for Morning or Afternoon
    timeOfDay = timeOfDay.split("")[0].toUpperCase() + timeOfDay.slice(1);
    let tableRowData = $('tbody tr');
    let arrayToCheck = [];
    angular.forEach(tableRowData, function(row, key){
      let timeValue = row.dataset.timeValue;
      let roomValue = row.dataset.roomValue;
      if (timeValue === "" || roomValue === ""){
        //using this to keep the data from checking against empty values for now
      } else {
        console.log(arrayToCheck)
        arrayToCheck.push([timeValue, roomValue]);
      }
    })
      if(!checkForConflicts(arrayToCheck)){
        console.log($scope.sessions)
        morningSchedule = scheduleTemplate.morning_sessions;
        afternoonSchedule = scheduleTemplate.afternoon_sessions;
        // Table saves time slot and room to the sessions object, matching the properties in sessions to the properties in the morning or afternoon schedule
        angular.forEach($scope.sessions, function(session, key){
          angular.forEach(morningSchedule.rooms, function(room, key){
              angular.forEach(room.times, function(timeSlot, key){
                if (session.Times === timeSlot.time && room.name === session.Room){
                  timeSlot.session.speaker = session['First Name'] + " " + session['Last Name'];
                  timeSlot.session.title = session.Title;
                  //to do
                  //timeSlot.session.url = ;
                }
              });
          });
        });
      if (timeOfDay === "Morning"){
        updateScheduleToFirebase(timeOfDay, morningSchedule)
        // After the morning schedule has been built, display the afternoon tab
        .then(() => Polling.setShowAfternoonTab(true));
      } else if (timeOfDay === "Afternoon"){
        updateScheduleToFirebase(timeOfDay, afternoonSchedule);
        }
      }
    }
    const updateScheduleToFirebase = (timeOfDay, schedule) => {
      console.log(schedule)
      return $http.put(`${Constants.firebaseUrl}/Schedules/${timeOfDay}.json`, schedule)
  }

    // console.log("room",sessionRoom)
    // console.log("time",sessionTime)
    // console.log("schedule", morningSchedule)


});
