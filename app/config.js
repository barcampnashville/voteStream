Application.config = {
	logo: 'images/logo_hn4.png'
}

angular.module('application.main')

.factory('Config', function(){
	return Application.config;
})
