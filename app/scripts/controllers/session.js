angular.module('BarcampApp')
    .controller('SessionCtrl', function ($scope, SessionService) {
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