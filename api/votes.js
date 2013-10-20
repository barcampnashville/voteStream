var Q = require('q');

module.exports = function(sio, db, config){

	return {
		/*
		* Cast a Vote
		*/
		vote: function(req, res){
            console.log('voting for!', req.sessionID);
			req.session.votes = (req.session.votes) ? req.session.votes : [];

            //Check to see if the user is in  the voters list
            if(!req.body.email){
                console.log('1');
                res.send(401, 'Email must be included!');
                return;
            }

            if(!req.session.registered){
                res.send(401, 'Session is not registered.');
                return;
            }

            if(req.body.email){
                req.session.email = req.body.email;
                if(req.body.name) req.session.name = req.body.name;

                if(!config.voters[req.body.email]){
                    var fishy = {name: req.body.name, email: req.body.email}
                    console.log('inserting fishy', req.body.email);
                    db.collection('fishy_votes').insert(fishy, function(err, results) {
                        if(err){
                            console.log('fishy insert error', err);
                        }
                    });
                }
            }

			//Only users can vote
			if(!req.sessionID){
                console.log('3');
				res.send(401);
				return;
			}

			//Don't allow users to vote more times than they are supposed to
			if(req.session.votes.length >= config.votes){
                console.log('4');
				res.send(401, "You've already used all your votes!");
				return;
			}

			//Make sure user is not making the same vote twice
			for(var i = 0;i<req.session.votes;i++){
                console.log('5');
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
