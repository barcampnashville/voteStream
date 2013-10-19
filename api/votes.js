module.exports = function(sio, mongoObject){
	return {
		vote: function(req, res){
			sio.sockets.emit('vote cast', req.params.id);
			castVote(req.params.id);
			res.send('ok');
		},
		results: function(req, res) {
      countVotes(function(results){
				res.send(results);
      });
		}
	}

  function countVotes(success) {
    
    var MongoClient = mongoObject.client;
    var format = mongoObject.format;
    var database = mongoObject.database;
    var collection_name = mongoObject.collection_name;

    MongoClient.connect(database, function(err, db) {

      if(err) throw err;

      var collection = db.collection(collection_name);

      collection.aggregate( [ {$group: { _id: '$vote', count: { $sum: 1 } } }], function(err, rsl) {
        console.log(rsl);
        success(rsl);
      });

    });

  }

  function castVote(id) {

    var MongoClient = mongoObject.client;
    var format = mongoObject.format;
    var database = mongoObject.database;
    var collection_name = mongoObject.collection_name;

    MongoClient.connect(database, function(err, db) {

      if(err) throw err;

      var collection = db.collection(collection_name);

      var data = {
        vote: id
      };
      
      collection.insert(data, function(err, docs) {

        collection.count(function(err, count) {
          console.log(format("count = %s", count));
        });

        // Locate all the entries using find
        collection.find().toArray(function(err, results) {
          console.dir(results);
          // Let's close the db
          db.close();
        });      
      });

    });
  }

}
