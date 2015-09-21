//switch code
angular.module('BarcampApp', ['ngAnimate'])
.controller('SwitchCtrl', ['$scope', function($scope){
  $scope.items =  ['morning', 'afternoon'];
  $scope.selection = $scope.items[0];
}]);