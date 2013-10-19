module.exports = function(sio, mongoObject){
	return {
		vote: function(req, res){
			castVote(req.params.id, function(){
				sio.sockets.emit('vote cast', req.params.id);
				res.send('ok');
			});
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

    var result;

    MongoClient.connect(database, function(err, db) {

      if(err) throw err;

      var collection = db.collection(collection_name);

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
	      success(count);
      });
    });

  }

  function castVote(id, success) {

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

	      if(!err){
	        success();
	      }
      });

    });
  }

}
