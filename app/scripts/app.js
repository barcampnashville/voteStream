angular.module('BarcampApp',[
	'ngRoute',
	'firebase',
	'webStorageModule'
])

.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/admin', {
					templateUrl : '/templates/admin.html',
					controller : 'AdminCtrl',
					allowAnonymousAccess:false,
					adminAccess: true,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing;
						}
					}
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingCtrl',
					allowAnonymousAccess:false,
					resolve: {
						Sessions: function (SessionListing) {
							return SessionListing();
						}
					}
				}).when('/login', {
					templateUrl : '/templates/signin.html',
					controller : 'SigninCtrl',
					allowAnonymousAccess:true
				})
				.when('/logout', {
					redirectTo:'/login',
					allowAnonymousAccess:true
				})
				.otherwise({
					redirectTo:'/sessions'
				});
		}
	])
.run(function ($rootScope, $location, $firebase, AuthService, User) {
	var lastPath,
		pollingRef = new Firebase('https://barcamp.firebaseio.com/PollingState');

	$rootScope.pollingSync = $firebase(pollingRef).$asObject();
	$rootScope.logout = AuthService.logout;

	$rootScope.$on("$routeChangeStart", function(evt, next) {
		// User navigating
		if (!$rootScope.user && !(next && next.$$route && next.$$route.allowAnonymousAccess)) {
			if (next.$$route.adminAccess && !$rootScope.user.admin) {
				$location.path('/sessions');
			}
			lastPath = next && next.path;
			evt.preventDefault();
			$location.path('/login');
		}
	});
});