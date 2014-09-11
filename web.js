var Firebase = require('firebase'),
	Root = new Firebase('https://barcamp.firebaseio.com/'),
	Users = Root.child('Users'),
	FirebaseTokenGenerator = require("firebase-token-generator"),
	tokenGenerator = new FirebaseTokenGenerator('2mRa3sWimzeObqBtByub4ZaV1TriagKsD2T0fsn1'),
	express = require("express"),
	app = express();

app.use(express.logger());
app.use(express.bodyParser());

app.post('/login', function(req, res) {

	var id = req.body.id;
	if (!id) {
		return res.send(401, { error: 'Invalid User ID' });
	}

	Users.child(id).once('value', function(snapshot) {

		var userData = snapshot.val();
		console.log('login.user.value', id, userData);

		if (!userData) {
			return res.send(401, { error: 'Invalid User ID' });
		}

		var token = tokenGenerator.createToken({
			user_id: id,
			is_admin: (userData.admin === true)
		});

		Users.auth(token, function(error) {

			if(error) {
				res.send(400, error);

			} else if ((/(?:text|application)\/x?html(?:\+xml)/i).test(req.headers.accept)) {
				res.cookie('auth', token);
				res.redirect('/');

			} else {
				res.send(200, token);

			}

		});

	});

});

app.get('/logout', function (req, res, next) {
	Users.unauth();

	if ((/(?:text|application)\/x?html(?:\+xml)/i).test(req.headers.accept)) {
		res.redirect('/');
	} else {
		res.send(204);
	}
	
});

// This serves up all the HTML pages on the site
// The port designation allows us to develop on 8083 but serve from heroku on standard ports
app.use("/", express.static(__dirname + "/app")).listen(process.env.PORT || 8083);
console.log("APP Server started successfully.");