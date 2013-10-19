Application.main.controller('ResultsController', ['$scope', '$http', 'Sockets', ResultsController]);
function ResultsController ( $scope, $http, Sockets ) {
	function draw(data){
		var el = document.getElementById('chart');
		var ael = angular.element(el)[0];
		var width = ael.offsetParent.clientWidth;
		var height = ael.offsetParent.clientHeight;
		ael.setAttribute('width', width);
		ael.setAttribute('height', height);
		var ctx = el.getContext('2d');

		var chartLabels = [];
		var chartData = [];

		var greatest = 0;
		for(var i=0;i<data.length;i++){
			chartLabels.push(data[i]['_id']);
			chartData.push(data[i]['count']);
			if(data[i]['count'] > greatest){
				greatest = data[i]['count'];
			}
		};

		var data = {
			labels : chartLabels,
			datasets : [
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					data : chartData
				}
			]
		}

		var steps = 3;
		var opts = {
			scaleShowGridLines: false,
			scaleOverride: true,
			scaleSteps: steps,
			scaleStepWidth: Math.ceil(greatest / steps),
			scaleStartValue: 0
		}

		new Chart(ctx).Bar(data, opts);
	}

	$http.get('/api/results')
		.success(function(data){
			if(data.length > 0){
				draw(data);
			}
		})
		.error(function(data){
		});

	$scope.model = {};
}
