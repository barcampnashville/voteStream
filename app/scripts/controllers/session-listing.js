angular.module('BarcampApp')
    .controller('SessionListingCtrl', function ($scope, AuthService) {
        $scope.myList = [];
        var sessionList;

        var userRef = new Firebase('https://barcamp.firebaseio.com/Users');
        if ($scope.user) {
            userRef.child($scope.user.d.user_id).child('voteCounts').on('value', function (snapshot) {
                $scope.votesRemaining = 4 - (snapshot.val() || 0);
            });
        }

        var morningCutoff = new Date(2013, 10, 2, 10);

        if (!$scope.sessions) {
            var SessionsRef = new Firebase('https://barcamp.firebaseio.com/Sessions');
            SessionsRef.once('value', function (snapshot) {
                $scope.sessions = snapshot.val();
                if (!$scope.$$phase) {
                    $scope.$apply();
                }
            });
        }

        if (morningCutoff.valueOf() > Date.now()) {
            sessionList = 'Morning';
        } else {
            sessionList = 'Afternoon';
        }

        $scope.sessionFilter = {
            Availability: sessionList
        };

        $scope.$on('upVote', function () {
            $scope.votesRemaining -= 1;
        });

        $scope.$on('downVote', function () {
            $scope.votesRemaining += 1;
        });

        $scope.castlot = {vote: false};

        $scope.upVote = function (session) {
            if ($scope.votesRemaining === 0) {
                return;
            }
            SessionService.increaseVote(session, $scope.user.d.id);
            $scope.$emit('upVote');
            $scope.castlot.vote = true;
            $scope.myList.push(session);
        };

        $scope.downVote = function (session) {
            if ($scope.votesRemaining > 4) {
                return;
            }
            $scope.castlot.vote = false;
            $scope.$emit('downVote');
            SessionService.decreaseVote(session, $scope.user.d.id);
            $scope.myList.splice($scope.myList.indexOf(session), 1);
        };
    })
;