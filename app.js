
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var app = express();
var io = require('socket.io');

var winston = require('winston');
//var MongoDB = require('winston-mongodb').MongoDB;
//winston.add(MongoDB, {db:'hacknashville', safe:false});
//winston.add(winston.transports.Console);
//MongoStore = require('connect-mongo')(express),

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

var sio = io.listen(9001);

sio.sockets.on('connection', function(socket){
	console.log('a socket has connected');
	socket.emit('foo', 'bar');
});

//Mongo
// var MongoClient = require('mongodb').MongoClient;
// var format = require('util').format;
// var database = 'mongodb://127.0.0.1:27017/test';
var mongoObject = {
  'client': require('mongodb').MongoClient,
  'format': require('util').format,
  'database': 'mongodb://127.0.0.1:27017/test',
  'collection_name': 'test_insert'
};

var items = require('./api/items');
var votes = require('./api/votes')(sio, mongoObject);

app.get('/api/items', items.list);
app.post('/api/vote/:id', votes.vote);
app.get('/api/results', votes.results);

// api errors
app.use(function failure (error, request, response, next ) {
  if ( error ) {
    winston.error("Error: ", error);
    response.send(500, 'Server Error');
  } else {
    next();
  }
});

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

