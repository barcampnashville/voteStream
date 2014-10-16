angular.module('BarcampApp')
	.factory('Session', function ($firebase, $rootScope) {
		var Session = function (session) {
			var ref = new Firebase('https://barcamp.firebaseio.com/Sessions2014/' + session.$id);
			this.voteCountRef = $firebase(ref.child('total_votes'));
			this.ref = $firebase(ref);
			this.inSync = this.ref.$asObject();
			this.id = session.$id;
			this.summary = session.Body;
			this.speaker = {
					firstName: session['First Name'],
					lastName: session['Last Name'],
					email: session['E-mail']
			};
			// this.categories = session['Session Category'];
			this.totalSignUps = session['Signup Counts'];
			this.time = session["Time Slot"];
			this.title = session.Title;
			this.room = session.Room;
			this.hashtag = session['Twitter Hashtag'];
			this.userVoted = false;
			
			this.inSync.$loaded().then(function () {
				this.inSync.removed = this.inSync.removed || false;
				this.totalVotes = this.inSync.total_votes;
				this.availability = this.inSync.Availability;
			}.bind(this))
		};

		Session.prototype.updateUserVoteStatus = function () {
			this.userVoted = !this.userVoted;
		}

		Session.prototype.vote = function (user) {
			if (user.voting) return;
			var val;
			user.updateSessions(this.id, function () {
				val = user.sync.sessions.indexOf(this.id) > -1 ? 1 : -1;
				this.userVoted = !this.userVoted;
				
				this.voteCountRef.$transaction(function (current) {
					return current + val;
				}).then(function (snapshot) {
					user.voting = false;
				}, function () {
					user.voting = false;
				});
			}.bind(this));
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