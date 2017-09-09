'use strict'
app.controller('FullScheduleCtrl', function ($scope) {

  //change from jQuery
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  firebase.database().ref('/Schedules').on('value', function(schedule){
    $scope.$apply();
    //morning or afternoon switch
    if (schedule.val().Morning){
    $scope.sortScheduleByTime(schedule.val(), "Morning");
    }
    if (schedule.val().Afternoon){
      $scope.sortScheduleByTime(schedule.val(), "Afternoon");
    }

  });

  $scope.sortScheduleByTime = (schedule, session) => {

    let scheduleObj = schedule[session].rooms;
    let numberOfRooms = Object.keys(scheduleObj).length;
    for (let i = 0; i <= numberOfRooms -1; i++) {
      for (let j = 0; j < scheduleObj[i].times.length; j++){
        $scope.rooms.push(scheduleObj[i].times[j])
        scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
      }
    }
    console.log($scope.rooms)
  }
    

});


