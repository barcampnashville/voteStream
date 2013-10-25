Application.main.controller('ResultsController', ['$scope', '$http', 'Sockets', 'voteables', ResultsController]);
function ResultsController ( $scope, $http, Sockets, voteables ) {
	function draw(data){
		var el = document.getElementById('chart');
		var ael = angular.element(el)[0];
		var width = ael.offsetParent.clientWidth - (ael.offsetLeft * 2);
		var height = (window.innerHeight - ael.offsetTop);
		ael.setAttribute('width', width);
		ael.setAttribute('height', height);
		var ctx = el.getContext('2d');

		var chartLabels = [];
		var chartData = [];
    var pieData = [];

		var greatest = 0;
		for(var i=0;i<data.length;i++){
			chartLabels.push(data[i]['_id']);
			chartData.push(data[i]['count']);
			if(data[i]['count'] > greatest){
				greatest = data[i]['count'];
			}

      pieData.push({value: data[i]['count'], color: get_random_rgb()});
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
			scaleStartValue: 0,
			animation: false
		}
		new Chart(ctx).Bar(data, opts);
    //
    //new Chart(ctx).Pie(pieData, opts);
	}

	$http.get('/api/results')
		.success(function(data){
			if(data.length > 0){
				draw(data);
			}
		})
		.error(function(data){
		});

	Sockets.on('vote cast', function(data){
		draw(data);
	});

	$scope.model = {items: []};

  for(var i = 0;i<voteables.length;i++){
    $scope.model.items.push({title: voteables[i].title, color: rgb(voteables[i].color)});
  }
}

function rgb(arr){
  var s = 'rgba(';
  for(var i = 0;i<arr.length;i++){
    s = s + arr[i]+',';
  }
  s = s + '1)';
  return s;
}

function get_random_rgb() 
{
    var r = function () { return Math.floor(Math.random()*256) };
    var color = 'rgba('+r()+','+r()+','+r()+',0.5)';
    return color;
}
