'use strict'

app.controller('FullScheduleCtrl', function ($scope, SessionListing) {

  SessionListing.realTimeSessions.on('value', function(sessions){
    $scope.fullSchedule = sessions.val();
    $scope.$apply();
  });

});


