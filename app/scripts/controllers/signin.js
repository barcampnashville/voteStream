angular.module('BarcampApp')
    .controller('SigninCtrl', function ($scope, $location,$http) {
        $scope.$watch('badgeId', function () {
            $scope.error = null;
        });
        $scope.login=(id)=>{
            $http.get('https://nashvillebarcamp.firebaseio.com/.json')
            .then(console.log)

        }
})
