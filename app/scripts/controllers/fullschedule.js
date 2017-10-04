'use strict'

app.controller('FullScheduleCtrl', function ($scope) {

  $scope.scheduleByTime = [];
  $scope.rooms = [];
  $scope.filterBy = "Time";
  $scope.morningRooms = [];
  $scope.afternoonRooms = [];

    $scope.sortScheduleByTime = (schedule, session) => {
        let scheduleObj = schedule[session].rooms;
        let numberOfRooms = Object.keys(scheduleObj).length;

        for (let i = 0; i <= numberOfRooms -1; i++) {
            for (let j = 0; j < scheduleObj[i].times.length; j++){
                if(session === "Morning") {
                  $scope.morningRooms.push(scheduleObj[i].times[j]);
                  scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
                }
                if(session === "Afternoon") {
                  $scope.afternoonRooms.push(scheduleObj[i].times[j]);
                  scheduleObj[i].times[j]["room"] = scheduleObj[i].name;
                }
            }
        }
    }

    $scope.setFilterString = (filterBy) => {
        $scope.filterBy = filterBy;
    };


    // This JS will execute on page load
    firebase.database().ref('/Schedules').on('value', function(schedule){
        $scope.scheduleHasLoaded = true;
        // If morning schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Morning){
            $scope.morningRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Morning");
            $scope.morningRooms = schedule.val().Morning;
        }

        // If afternoon schedule has been posted to Firebase, populate the schedule
        if (schedule.val() && schedule.val().Afternoon){
            $scope.afternoonRooms = [];
            // $scope.sortScheduleByTime(schedule.val(), "Afternoon");
            $scope.afternoonRooms = schedule.val().Afternoon
        }

        if (!schedule.val()) {
            $scope.morningRooms = [];
            $scope.afternoonRooms = [];
        }

        //checks if $digest is in progress, if first time user visit or on refresh $scope.$apply, else simply let digest run
        if (!$scope.$$phase) {
            $scope.$apply();
        }
    });

});
