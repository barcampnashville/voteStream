angular.module('BarcampApp')
    .controller('ScheduleCtrl', function ($scope) {
/*
        var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions2014');
*/
        var SessionsRef = new Firebase('https://nashvillebarcamp.firebaseio.com/Sessions2014');

/*        SessionsRef.on('value', function (snapshot) {
            $scope.sessions = snapshot.val();
            if (!$scope.$$phase) {
                $scope.$apply();
            }

        });
*/
        $scope.inRoom = function (item) {
            return item.Room ? item.Room.length > 0 : false;
        };
    })
;
