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
	.service('SessionListing', function ($firebase, $q, NormalizeSession) {
		var defer = $q.defer();
		var items = [];
		if (items.length > 0) {
			defer.resolve(items);
		}
		var list = $firebase(new Firebase('https://barcamp.firebaseio.com/Sessions')).$asArray();
		list.$loaded().then(function (sessions) {
			sessions.forEach(function (sess) {
				items.push(NormalizeSession(sess));
			});
			defer.resolve(items);
		});
		return defer.promise;
	})
	.factory('NormalizeSession', function () {
		return function (session) {
			return {
				id: session.id,
				availability: session.Availability,
				summary: session.Body,
				speaker: {
					firstName: session['First Name'],
					lastName: session['Last Name'],
					email: session['E-mail']
				},
				categories: session['Session Category'],
				totalSignUps: session['Signup Counts'],
				time: session.Time,
				title: session.Title,
				hashtag: session['Twitter Hashtag'],
				totalVotes: session.total_votes
			}
		}
	})
;