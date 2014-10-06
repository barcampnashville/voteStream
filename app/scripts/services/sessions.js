angular.module('BarcampApp')
	.factory('Session', function ($firebase) {
		var Session = function (session, id) {
			this.ref = new Firebase('https://barcamp.firebaseio.com/Sessions/' + id);
			this.sessObj = $firebase(this.ref).$asObject();
		};

		Session.prototype.vote = function (val) {
			this.voteRef.transaction(function (current) {
				return current + val;
			});
		};

		return Session;
	})
	.service('SessionListing', function ($firebase, $q) {
		var defer = $q.defer();
		var list = $firebase(new Firebase('https://barcamp.firebaseio.com/Sessions')).$asArray();
		list.$loaded().then(function (items) {
			defer.resolve(items);
		});
		return defer.promise;
	})
;