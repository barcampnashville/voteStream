Application.config = {
	logo: 'http://hacknashville.com/static/images/bg/logo.png'
}

angular.module('application.main')

.factory('Config', function(){
	return Application.config;
})
