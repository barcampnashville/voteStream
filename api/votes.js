var Q = require('q');

module.exports = function(sio, db, config){

	return {
		/*
		* Cast a Vote
		*/
		vote: function(req, res){
            console.log('voting for!', req.sessionID);
			req.session.votes = (req.session.votes) ? req.session.votes : [];

			//Only users can vote
			if(!req.sessionID){
				res.send(401);
				return;
			}

			//Don't allow users to vote more times than they are supposed to
			if(req.session.votes.length >= config.votes){
				res.send(401, "You've already used all your votes!");
				return;
			}

			//Make sure user is not making the same vote twice
			for(var i = 0;i<req.session.votes;i++){
				if(req.session.votes[i]['id'] == req.params.id){
					res.send(401, "You already voted for this option!");
					return;
				}
			}

			castVote(req.params.id, req.sessionID, req.session).then(countVotes)
			.then(function(results) {
				sio.sockets.emit('vote cast', results);
				res.send('ok');
			});
		},
		/*
		* Check Results
		*/
		results: function(req, res) {
            countVotes().then(function(results){
				res.send(results);
            });
		},
        clearmy: function(req, res){
            req.session.votes = [];
            res.send('ok');
        }
	}

  function countVotes() {
		var collection = db.collection('votes')
		return Q.ninvoke(collection, 'aggregate', [ {$group: { _id: '$vote', count: { $sum: 1 } } }])
  }

  function castVote(id, sid, session) {
    var data = {vote: id, by: sid};
		session.votes.push(data);
		var collection = db.collection('votes');
    return Q.ninvoke(collection, 'insert', data)
		.then(function(results) {
			return results;
		});
  }

}
