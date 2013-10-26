
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var io = require('socket.io');
var mongodb = require('mongodb');
var winston = require('winston');
var request = require('request');
//var MongoDB = require('winston-mongodb').MongoDB;
//winston.add(MongoDB, {db:'hacknashville', safe:false});
//winston.add(winston.transports.Console);
var MongoStore = require('connect-mongo')(express);
colors = {};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'release')));
app.use(express.static(path.join(__dirname, 'app')));
app.use(express.static(path.join(__dirname, '')));
var mongoObject = {
  'client': mongodb.MongoClient,
  'format': require('util').format,
  'database': 'mongodb://127.0.0.1:27017/test'
};
app.use(express.cookieParser());
app.use(express.session({
	secret: 'foobarbaz',
	store: new MongoStore({
		url: 'mongodb://127.0.0.1:27017/test'
	}),
	key: 'express.sid'
}));
app.use(app.router);

var sio = io.listen(9001);
sio.sockets.on('connection', function(socket){
});

var config = require('./config').config();

mongodb.MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db){
if(err){
			console.log('error!', err);
		} else {
			console.log('mongo connected!');
			routes(sio, db, config, colors);
		}
});

function routes(sio, db, config, colors) {
	
	var items = require('./api/items')(sio, db, config);
	var votes = require('./api/votes')(sio, db, config, colors);
	
	app.get('/api/check', function(req, res){
		res.send('ok');
	});

  app.post('/api/items/new', items.add);
	app.get('/api/items', items.list);
	app.post('/api/vote/:id', votes.vote);
	app.get('/api/vote/:id', votes.vote); // temp for my testing
	app.get('/api/results', votes.results);
  app.post('/api/voterdetails', function(req, res){
    console.log(req.body);
    if(req.body.name && req.body.email && req.body.voting_id){
      req.session.name = req.body.name;
      req.session.email = req.body.email;
      req.session.voting_id = req.body.voting_id;
      res.send('ok');
    } else {
      res.send('500');
    }
  });
	app.get('/api/info', function(req, res){
    if(!req.session.registered){
        req.session.registered = true;
    }

    data = {
      votes: config.votes,
      myvotes: (req.session.votes) ? req.session.votes : []
    }

    console.log('session data', req.session);
    if(req.session.email && req.session.name){
        data.voterinfo = {email: req.session.email, name: req.session.name};
    }

		res.json(data);
	});
  /*app.get('/api/clear/:pass', function(req, res){
    if(req.params.pass == 'Gr80ne'){
      db.collection('fishy_votes').remove({}, function(err, removed){});
      db.collection('votes').remove({}, function(err, removed){});
      db.collection('voteables').remove({}, function(err, removed){});
    }
    res.send('ok');
  });*/
  app.get('/api/fishy', function(req, res){
      db.collection('fishy_votes').find({}).toArray(function(err, items){
          res.json(items);
      });
  });
  app.get('/api/myvotes/clear', votes.clearmy);
  app.get('/api/testdance', function(req, res){
    var url = 'http://192.168.14.69:8080/api/scaled';
    var json = 'data=[{"color":[255,0,0], "value":21},{"color":[0,255,0], "value":8}]';
    var  opts = {
      headers: {'content-type':'application/x-www-form-urlencoded'},
      method: 'POST',
      url: url,
      body: 'data=[{"color":[0,0,0], "value":7},{"color":[0,255,0], "value":21}]'
      //JSON.stringify(json)
    };
    request.post(opts);
    res.send('ok');
  });

	
	// api errors
	app.use(function failure (error, request, response, next ) {
			if ( error ) {
					winston.error(error.stack);
					response.send(500, 'Server Error');
			} else {
					next();
			}
	});
	
	// development only
	if ('development' == app.get('env')) {
			app.use(express.errorHandler());
	}
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
