// test user with admin privledges: 03sbtn

var TOKEN = process.env.FIREBASE_TOKEN,
	Firebase = require('firebase'),
	Root = new Firebase('https://barcamp.firebaseio.com/'),
	Users = Root.child('Users'),
	FirebaseTokenGenerator = require("firebase-token-generator"),
	tokenGenerator = new FirebaseTokenGenerator(TOKEN),
	express = require("express"),
	app = express(),
	port = process.env.PORT || 8083;
	var server = new Firebase('https://barcamp.firebaseio.com/Users2014');
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

// This serves up all the HTML pages on the site
// The port designation allows us to develop on 8083 but serve from heroku on standard ports
if (app.get('env') === 'development') {
	app.use("/", express.static(__dirname + "/app")).listen(port);
} else {
	app.use("/", express.static(__dirname + "/release")).listen(port);
}

console.log("APP Server started successfully on port " + port);
