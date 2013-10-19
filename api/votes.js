var Q = require('q');

module.exports = function(sio, db, config){

	return {
		vote: function(req, res){
			//console.log('vote! ', req.params.id);
			req.session.votes = (req.session.votes) ? req.session.votes : 0;
			req.session.votes = req.session.votes + 1;

			//Only users can vote
			if(!req.session.cookie){
				res.send(401);
				return;
			}

			//Don't allow users to vote more times than they are supposed to
			if(req.session.votes >= config.votes){
				res.send(401, "You've already used all your votes!");
				return;
			}

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
			//return results;
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
