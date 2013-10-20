var Application = window.Application = window.Application || {};
Application.main = angular.module('application.main', [])

.factory('Sockets', function(){
	return io.connect('ws://192.168.14.66:9001');
});
//Application.Resolvers = {};
