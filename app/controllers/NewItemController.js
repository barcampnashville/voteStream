Application.main.controller('NewItemController', ['$scope', '$http', '$timeout', NewItemController]);
function NewItemController($scope, $http, $timeout) {


  $scope.submitItem = function() {

    var people = [];
    $scope.people.split(',').forEach(function(name) {
      people.push(capitaliseFirstLetters(name.trim()));
    });

    data = {
      "id": $scope.title,
      "title": $scope.title,
      "people": people,
      "description": $scope.description
    }

    $http.post('/api/items/new', data)
      .success(function(data) {
        $scope.created = true;

        $timeout(function() {
          window.location = '/';
        }, 4000);

      })
      .error(function(data) {

      });

    function capitaliseFirstLetters(string) {
      var result = [];
      string.split(' ').forEach(function(name) {
        result.push(capitaliseFirstLetter(name));
      });
      return result.join(' ');

      function capitaliseFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);  
      }
    }

  }
}