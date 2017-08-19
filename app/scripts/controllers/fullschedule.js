'use strict'

app.controller('FullScheduleCtrl', function ($scope, SessionList) {

  firebase.database().ref('/Sessions').on('value', function(session) {
    $scope.fullSchedule = session.val();
    $scope.$apply();
  });

  $scope.sessions = SessionList;

  //2BFJQPYM

	 $scope.sortAlphabeticaly = (property) => {	
	 	let sessionsArray = Object.values($scope.sessions)
	 	//creat array of objs with property passed in and 
		let propertyArr = sessionsArray.map(function(session, index) { 
			let propertyArray = {}
			propertyArray[property] = session[property]
			propertyArray.index = index
			return propertyArray
		});
		//sort based on property alphabetically
		propertyArr.sort(function(a, b) {
			if (a[property].toLowerCase() < b[property].toLowerCase()) {
				return -1;
			}
			if (a[property].toLowerCase() > b[property].toLowerCase()) {
				return 1;
			}
			return 0;
		});
		//create new array of indexes to filter on
		$scope.sortedSessions = [];
		propertyArr.forEach(function(session) {
			$scope.sortedSessions.push(sessionsArray[`${session.index}`])
		})
		console.log($scope.sortedSessions)
	}

	$scope.sortAlphabeticaly('Title')


});



