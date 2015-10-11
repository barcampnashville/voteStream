// test user with admin privledges: 03sbtn

var TOKEN = process.env.FIREBASE_TOKEN,
	Firebase = require('firebase'),
	Root = new Firebase('https://nashvillebarcamp.firebaseio.com/'),
	Users = Root.child('Users'),
	Sessions = Root.child('Sessions'),
	FirebaseTokenGenerator = require("firebase-token-generator"),
	tokenGenerator = new FirebaseTokenGenerator(TOKEN),
	express = require("express"),
	request = require("request"),
	app = express(),
	port = process.env.PORT || 8083;
	var server = new Firebase('https://nashvillebarcamp.firebaseio.com/Users');
	server.auth(TOKEN);

app.use(express.bodyParser());

app.post('/login', function(req, res) {
	var id = req.body.id;
	if (!id) {
		return res.send(401, { error: 'Invalid User ID' });
	}

	server.child(id).on('value', function(snapshot) {

		var userData = snapshot.val();
		console.log(userData);

		if (!userData) {
			return res.send(401, { error: 'Invalid User ID' });
		}
		userData.id = id;

		var token = tokenGenerator.createToken({
			uid: id.toString(),
			user_id : id.toString(),
			admin: (userData.admin === true)
		});

		res.send(200, {token: token, user: userData});
	});

});

app.get('/logout/:id', function (req, res, next) {
	Users.child(req.params.id).unauth();

	if ((/(?:text|application)\/x?html(?:\+xml)/i).test(req.headers.accept)) {
		res.redirect('/');
	} else {
		res.send(204);
	}

});

app.get('/favorites/:token/:bcnusername', function (req, res, next) {
	var bcnusername = req.params.bcnusername;
	var favoritesIds = [];
	// Create a request to the BCN14 site
	// TODO: Make this more generic. We shouldn't be looking at bcn14 statically.
	request({uri: "http://www.barcampnashville.org/bcn14/users/"+ bcnusername +"/attending"}, function(error, response, body) {
		var data = JSON.parse(body);
		var userRef = Users.child(req.params.token);
		var titleArray = [];

		// Prepare a list of the favorite choices from the BCN website for this user
		data['favorited sessions'].forEach(function (item) {
			titleArray.push(item.session.Title);
		});

		// Take a look at the sessions in firebase, and compare the titles (no ids from BCN - next best thing is the title)
		Sessions.once("value", function (sessionSnapshot) {
			sessionSnapshot.forEach(function (childSnapshot) {
				if (titleArray.indexOf(childSnapshot.val().Title) > -1) {
					favoritesIds.push(childSnapshot.name());
				}
			});
			// Update the token's list of favorites with what we just got back from the bcn website
			userRef.update({favorites: favoritesIds});
			res.send(200, {favorites: favoritesIds});
		});
	});
});

// This serves up all the HTML pages on the site
// The port designation allows us to develop on 8083 but serve from heroku on standard ports
if (app.get('env') === 'development') {
	app.use("/", express.static(__dirname + "/app")).listen(port);
} else {
	app.use("/", express.static(__dirname + "/release")).listen(port);
}

console.log("APP Server started successfully on port " + port);
