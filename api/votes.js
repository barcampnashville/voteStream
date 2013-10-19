module.exports = function(sio, mongoObject) {

	return {
		vote: function(req, res){
			castVote(req.params.id, function(){
				countVotes(function(results){
					res.send('ok');
					sio.sockets.emit('vote cast', results);
				});
			});
		},
		results: function(req, res) {
      countVotes(function(results){
				res.send(results);
      });
		}
	}

  function countVotes(success) {

    DB(function(db) {
      var collection = db.collection('test_insert');
      collection.aggregate( [ {$group: { _id: '$vote', count: { $sum: 1 } } }], function(err, rsl) {
        console.log(rsl);
        success(rsl);
      });
    });
  }

  function castVote(id, success) {

    DB(function(db) {
      var collection = db.collection('test_insert');
      var data = {
        vote: id
      };
      collection.insert(data, function(err, docs) {
        if(!err) {
          success();
        }
      });
    });

  }

}
