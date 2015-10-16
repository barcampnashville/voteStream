angular.module('BarcampApp')
    .controller('AdminCtrl', function ($scope, $rootScope, $interval, $firebase, Sessions) {
        $rootScope.pollingSync.$bindTo($scope, 'polling');
        $scope.sessions = Sessions;
        $scope.currenttime = new Date().toLocaleTimeString();
        $interval(function () {
            $scope.currenttime = new Date().toLocaleTimeString();
        }, 1000);

        $scope.remove = function (s) {
            s.inSync.removed = !s.inSync.removed;
            s.inSync.$save();
        }

        $scope.resetVotes = function() {
          if (confirm("Are you sure you want to reset the votes for all sessions?")) {
            Sessions.forEach(function(session) {
              session.total_votes = 1;
              session.inSync.$save();
              console.log(session.total_votes);
            });
          } else {
            return;
          }
        }
    })
;
