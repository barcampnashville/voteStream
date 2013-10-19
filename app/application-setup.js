var Application = window.Application = window.Application || {};
Application.main = angular.module('application.main', [])

.factory('Sockets', function(){
	return io.connect('ws://localhost:9001');
});
//Application.Resolvers = {};
