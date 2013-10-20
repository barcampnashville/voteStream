Application.main.directive('onFinishRender', function($timeout){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
      if(scope.$last === true){
        $timeout(function(){
          scope[attrs.onFinishRender]();
        })
      }
    }
  }
});

Application.main.directive('loadingWheel', function(){
  return {
    restrict: 'A',
    link: function(scope, el, attrs){
        var opts = {
          lines: 13, // The number of lines to draw
          length: 20, // The length of each line
          width: 10, // The line thickness
          radius: 30, // The radius of the inner circle
          corners: 1, // Corner roundness (0..1)
          rotate: 0, // The rotation offset
          direction: 1, // 1: clockwise, -1: counterclockwise
          color: '#000', // #rgb or #rrggbb or array of colors
          speed: 1, // Rounds per second
          trail: 60, // Afterglow percentage
          shadow: false, // Whether to render a shadow
          hwaccel: false, // Whether to use hardware acceleration
          className: 'spinner', // The CSS class to assign to the spinner
          zIndex: 2e9, // The z-index (defaults to 2000000000)
          top: 'auto', // Top position relative to parent in px
          left: 'auto' // Left position relative to parent in px
        };
        var elById = document.getElementById('loading');
        console.log(elById);
        var spinner = new Spinner(opts).spin(elById);
    }
  }
});
