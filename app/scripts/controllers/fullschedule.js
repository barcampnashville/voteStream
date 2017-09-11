'use strict'
app.controller('FullScheduleCtrl', function ($scope) {

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  $scope.filterBy = "time";
  $scope.morningRooms = [];
  $scope.afternoonRooms = [];
  $scope.Afternoon = false;
  $scope.Morning = false;

  firebase.database().ref('/Schedules').on('value', function(schedule){
    $scope.rooms = [];
    $scope.scheduleByTime = [];
    if (schedule.val().Morning){
      $scope.morningRooms = [];
      $scope.sortScheduleByTime(schedule.val(), "Morning");
      checkIfScheduleExists(schedule.val().Morning, "Morning");
    }
    if (schedule.val().Afternoon){
      console.log(schedule.val().Afternoon)
      $scope.afternoonRooms = [];
      $scope.sortScheduleByTime(schedule.val(), "Afternoon");
      checkIfScheduleExists(schedule.val().Afternoon, "Afternoon");
    }
    $scope.$apply();
  });

  $scope.sortScheduleByTime = (schedule, session) => {
    let scheduleObj = schedule[session].rooms;
    let numberOfRooms = Object.keys(scheduleObj).length;
    for (let i = 0; i <= numberOfRooms -1; i++) {
      for (let j = 0; j < scheduleObj[i].times.length; j++){
        if(session === "Morning"){
          $scope.morningRooms.push(scheduleObj[i].times[j])
          scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
        }
        if(session === "Afternoon"){
          $scope.afternoonRooms.push(scheduleObj[i].times[j])
          scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
        }
      }
    }
  }
  
  $scope.setFilterString = (filterBy) => {
    $scope.filterBy = filterBy;
  }

  let checkIfScheduleExists = (schedule, timeOfDay) => {
    if(schedule[timeOfDay] === true){
      $scope[timeOfDay] = true;
    }
  }

});


