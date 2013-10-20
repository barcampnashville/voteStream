Application.main.controller('NewItemController', ['$scope', '$http', NewItemController]);
function NewItemController($scope, $http) {
  $scope.submitItem = function() {
    
    console.log('let me die');
    console.log($scope.title + ' ' + $scope.people + ' ' + $scope.description);
    console.log('in my footsteps');

    var people = [];
    $scope.people.split(',').forEach(function(name) {
      people.push(name.trim());
    });

    data = {
      "id": $scope.title,
      "title": $scope.title,
      "people": people,
      "description": $scope.description
    }

    $http.post('/api/items/new', data)
      .success(function(data) {

      })
      .error(function(data) {

      });
  }
}