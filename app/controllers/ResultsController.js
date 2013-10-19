Application.main.controller('ResultsController', ['$scope', '$http', ResultsController]);
function ResultsController ( $scope, $http ) {
	function draw(){
		var el = document.getElementById('chart');
		var ael = angular.element(el)[0];
		var width = ael.offsetParent.clientWidth;
		var height = ael.offsetParent.clientHeight;
		ael.setAttribute('width', width);
		ael.setAttribute('height', height);
		console.log(angular.element(el));
		var ctx = el.getContext('2d');

		var data = {
			labels : ["foo", "bar"],
			datasets : [
				{
					fillColor : "rgba(151,187,205,0.5)",
					strokeColor : "rgba(151,187,205,1)",
					data : [25,48]
				}
			]
		}

		var opts = {
			scaleShowGridLines: false
		}

		new Chart(ctx).Bar(data, opts);
	}

	$http.get('/api/results')
		.success(function(data){
			console.log(data);
		})
		.error(function(data){
			console.log(data);
		});
	$scope.model = {};
	draw();
}
