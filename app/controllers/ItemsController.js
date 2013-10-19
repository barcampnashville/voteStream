Application.main.controller('OrganizationController', ['$scope', 'organization', 'plans', OrganizationController]);
function OrganizationController ( $scope, $dispatcher, items ) {
  $scope.model.items = items;
}
