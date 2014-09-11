angular.module('BarcampApp')
    .controller('ResultsCtrl', function ($scope, angularFire) {
        var ref = new Firebase('https://barcamp.firebaseio.com/Sessions');

        $scope.sessions = angularFire(ref, $scope, 'sessions');
        $scope.gridOptions = {
            data: 'sessions' ,
            enableColumnResize: true,
            enableRowSelection: true,
            multiSelect: false,
            enableColumnReordering: true,
            enableCellEditOnFocus: true,
            columnDefs: [
                {field: 'id', displayName: 'ID', enableCellEdit: false, width: '10%'},
                {field: 'Title', displayName: 'Title', enableCellEdit: false, width: '30%'},
                {field: "Username", displayName: 'Username', enableCellEdit: false, width: '10%'},
                {field: 'Room', displayName:'Room', enableCellEdit: true, width: '8%'},
                {field: 'Time', displayName:'Time', enableCellEdit: true, width: '8%'},
                {field: 'Availability', displayName:'Availability', enableCellEdit: true, width: '24%'},
                {field: 'total_votes', displayName:'Votes', enableCellEdit: false, width: '10%'}
            ]
        };

        var pollingStateRef = new Firebase('https://barcamp.firebaseio.com/PollingState');
        $scope.$watch("pollingIsActive", function (newValue) {
            pollingStateRef.set(newValue);
        });
    })
;