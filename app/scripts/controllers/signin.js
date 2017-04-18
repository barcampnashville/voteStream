angular.module('BarcampApp')
    .controller('SigninCtrl', function ($scope, $location) {
        $scope.$watch('badgeId', function () {
            $scope.error = null;
        });

        $scope.login=(id)=>{
            console.log(id)

        }
})
