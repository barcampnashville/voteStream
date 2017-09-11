'use strict'


app.controller('FullScheduleCtrl', function ($scope, SessionListing) {
  SessionListing.realTimeSessions.on('value', function(sessions){
    $scope.fullSchedule = sessions.val();
    $scope.$apply();
  });

  $scope.sessions = SessionList;
  console.log("SessionList:", SessionList);
  $scope.sortedSessions = SessionList //by default

	const sortAlpha = (property) => { 	
		const propertyArray = Object.values($scope.sessions)
		//sort based on property alphabetically
		propertyArray.sort(function(a, b) {
			if (a[property].toLowerCase() < b[property].toLowerCase()) {
				return -1;
			}
			if (a[property].toLowerCase() > b[property].toLowerCase()) {
				return 1;
			}
			return 0;
		});
		$scope.sortedSessions = propertyArray;
	}
	sortAlpha('Last Name');

});



