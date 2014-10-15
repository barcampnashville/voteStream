angular.module('BarcampApp')
	.factory('Session', function ($firebase) {
		var Session = function (session) {
			var id = session.$id;
			this.ref = new Firebase('https://barcamp.firebaseio.com/Sessions2013/' + id);
			this.id = session.$id;
			this.availability = session.Availability;
			this.summary = session.Body;
			this.speaker = {
					firstName: session['First Name'],
					lastName: session['Last Name'],
					email: session['E-mail']
			};
			this.categories = session['Session Category'];
			this.totalSignUps = session['Signup Counts'];
			this.time = session["Time Slot"];
			this.title = session.Title;
			this.room = session.Room;
			this.hashtag = session['Twitter Hashtag'];
			this.totalVotes = session.total_votes;
		};

		Session.prototype.vote = function () {
			/*this.voteRef.transaction(function (current) {
				return current + val;
			});*/
		};

		return Session;
	})
	.service('SessionListing', function ($firebase, $q, Session) {
		var defer = $q.defer();
		var items = [];
		if (items.length > 0) {
			defer.resolve(items);
		}
		var list = $firebase(new Firebase('https://barcamp.firebaseio.com/Sessions2014')).$asArray();
		list.$loaded().then(function (sessions) {
			sessions.forEach(function (sess) {
				items.push(new Session(sess));
			});
			defer.resolve(items);
		});
		return defer.promise;
	})
;