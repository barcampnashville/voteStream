module.exports = function(sio, db, config){
  return {
    list: function(req, res) {
      db.collection('voteables').find({}).toArray(function(err, items) {
        res.send(items);
      });
    },

    //misformed input post should be handled
    add: function(req, res) {
      if (req && req.body) {
        var data = req.body;
        var item = {
          id: data.id,
          title: data.title,
          people: data.people,
          description: data.description
        }
        for (var prop in item) {
            if (item[prop] === undefined) {
              res.send(500);
              return;
            }
        }
        db.collection('voteables').insert(item, function(err, results) {
          res.send(results);
        });
      }
    }
  }
}
