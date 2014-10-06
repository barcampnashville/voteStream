angular.module('BarcampApp')
	.factory('User', function () {
		var User = function (user) {
			this.ref = new Firebase('https://barcamp.firebaseio.com/Users/' + user.uid);
			this.id = user.uid;
			this.admin = user.admin;
		};

		User.prototype.getVotes = function () {

		};

		return User;
	})
;