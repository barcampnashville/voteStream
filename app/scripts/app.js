angular.module('BarcampApp',['ngRoute','firebase','ngGrid','webStorageModule'])

.config([
		'$routeProvider',
		function ($routeProvider) {
			$routeProvider
				.when('/results', {
					templateUrl : '/templates/results.html',
					controller : 'ResultsCtrl',
					allowAnonymousAccess:false
				})
				.when('/sessions', {
					templateUrl: '/templates/sessionlist.html',
					controller: 'SessionListingCtrl',
					allowAnonymousAccess:true
				})
				.when('/schedule', {
					templateUrl: '/templates/schedule.html',
					controller: 'ScheduleCtrl'
				})
				.when('/login', {
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
.run(function ($rootScope, $location, AuthService) {
	 var lastPath,
         pollingStateRef = new Firebase('https://barcamp.firebaseio.com/PollingState');

        $rootScope.logout = AuthService.logout;

        $rootScope.$on("$routeChangeStart", function(evt, next, current) {
            // User navigating
            if (!AuthService.user && !(next && next.$$route && next.$$route.allowAnonymousAccess)) {
                lastPath = next && next.path;
                evt.preventDefault();
                $location.path('/login');
            }
        });

        $rootScope.$on("angularFireAuth:login", function(evt, user) {
            // return to the attempted authenticated location
            $rootScope.user = user;
            lastPath = '';
            $location.path(lastPath || '/sessions');
        });

        $rootScope.$on("angularFireAuth:logout", function(evt, user) {
            // User logged out.
            $location.path('/login');
        });

        $rootScope.$on("angularFireAuth:error", function(evt, err) {
            // There was an error during authentication.
            $location.path('/login');
        });

        pollingStateRef.on('value', function (snapshot) {
            $rootScope.$broadcast('polling', snapshot.val());
        });
});