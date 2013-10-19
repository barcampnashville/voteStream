module.exports = function(sio, db, config){
	return {
		list: function(req, res){
			console.log(config.voteables);
	    res.send(config.voteables);
		},
    add: function(req, res) {
      addItem(req.body, function() {
        console.log(req.body);
        res.send('ok');
      });
      
    }
	}

  function addItem(item, success) {

    var collection = db.collection('voteables');
    collection.insert(item, function(err, docs) {
      if (!err) {
        success();
      }
    });

  }
}
