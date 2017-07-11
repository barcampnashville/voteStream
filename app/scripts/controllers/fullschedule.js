'use strict'

app.controller('FullScheduleCtrl', function ($scope) {

  firebase.database().ref('/Sessions').on('value', function(session) {
    $scope.fullSchedule = session.val();
    $scope.$apply();
  });

});


