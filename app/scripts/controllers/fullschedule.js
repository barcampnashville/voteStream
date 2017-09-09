'use strict'
app.controller('FullScheduleCtrl', function ($scope) {

  //change from jQuery
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  $scope.sessionsByTime = [];

  firebase.database().ref('/Sessions').on('value', function(session) {
    $scope.allSessions = session.val();
    $scope.$apply();
  });
  firebase.database().ref('/Schedules').on('value', function(schedule){
    $scope.fullSchedule = schedule.val();
    console.log($scope.fullSchedule);
    $scope.$apply();
    $scope.sortScheduleByTime();
  });

  $scope.sortScheduleByTime = () => {

    let scheduleObj = $scope.fullSchedule.Morning.rooms;
    let numberOfRooms = Object.keys(scheduleObj).length;
    for (let i = 0; i <= numberOfRooms -1; i++) {
      $scope.rooms.push(scheduleObj[i])
      for (let j = 0; j < scheduleObj[i].times.length; j++){
        $scope.rooms[i].times[j]["room"] = $scope.rooms[i].name;
      }
      $scope.sessionsByTime["times"] = Object.values(scheduleObj[i].times);
      //take name add it to each object in times array and add it to each object it times array and push each of those into scope array

    }

    console.log($scope.sessionsByTime)
    console.log($scope.rooms)


      
    


  }
    





});


