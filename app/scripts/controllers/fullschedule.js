'use strict'
app.controller('FullScheduleCtrl', function ($scope) {
  $('#myTabs a').click(function (e) {
    e.preventDefault();
    $(this).tab('show');
  });
  $scope.fullSchedule = "";

  firebase.database().ref('/Sessions').on('value', function(session) {
    $scope.allSessions = session.val();
    // console.log($scope.fullSchedule);
    $scope.$apply();
  });
  firebase.database().ref('/Schedules').on('value', function(schedule){
    $scope.fullSchedule = schedule.val();
    console.log($scope.fullSchedule);
    $scope.$apply();
  });

  



});


