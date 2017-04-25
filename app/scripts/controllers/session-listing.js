'use strict';

app.controller('SessionListingCtrl', function($scope, SessionListing) {
	$('#myTabs a').click(function (e) {
    e.preventDefault()
    $(this).tab('show')
  })
	SessionListing.getAllSessions().
	then(sessionList => {
			$scope.sessions = sessionList
			console.log($scope.sessions)
		})
	});
