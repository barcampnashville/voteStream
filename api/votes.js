var Q = require('q');

module.exports = function(sio, db){

	return {
		vote: function(req, res){
			//console.log('vote! ', req.params.id);
			castVote(req.params.id).then(countVotes)
			.then(function(results) {
				console.log(results);
				res.send('ok');
			});
		},
		results: function(req, res) {
      countVotes().then(function(results){
				res.send(results);
      });
		}
	}

  function countVotes() {
		var collection = db.collection('test_insert')
		return Q.ninvoke(collection, 'aggregate', [ {$group: { _id: '$vote', count: { $sum: 1 } } }])
		//.then(function( results ) {
			//console.log(results);
			return results;
		//});
  }

  function castVote(id) {
    var data = {vote: id};
		var collection = db.collection('test_insert');
    return Q.ninvoke(collection, 'insert', data)
		.then(function(results) {
			//console.log(results);
			sio.sockets.emit('vote cast', results);
			return results;
		});
  }

}
