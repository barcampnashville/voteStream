module.exports = function(sio, db, config){
  return {
    createids: function(req, res) {
       
      db.collection('voting_ids',function(err, collection){
         collection.remove({},function(err, removed){
         });
      });

      var ids = [];
      for (var i = 0; i < 1000; i++) {
       ids.push(makeid());
      }
      var data = { keys: ids };
      db.collection('voting_ids').insert(data, function(err, results) {
       if (err) res.send('err ' + new Date());
       res.send(data);
       // res.send(results.join("\n") + '\n' + new Date());
      });
      function makeid() {
         var text = "";
         var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
         for( var i=0; i < 6; i++ )
             text += possible.charAt(Math.floor(Math.random() * possible.length));
         return text;
      }
    }
  }
}