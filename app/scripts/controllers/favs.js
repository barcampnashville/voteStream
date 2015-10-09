angular.module('BarcampApp')
  .controller('FavsCtrl', function ($scope, BarCamp) {

     (function() {
       BarCamp.getBar(function(data) {
         $scope.data = data;
       })
     })();


  })

.factory('BarCamp', function ($http) {

  return {
    getBar: function(cb) {
      $http.defaults.useXDomain = true;
      $http({
        url: 'http://www.barcampnashville.org/bcn14/users/17/attending',
        crossOrigin: true,
        type: 'POST'
      }).success(function(data) {
        cb(data)
      })
      }
    }

  })
