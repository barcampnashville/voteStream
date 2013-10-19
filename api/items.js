
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send([{name:'test server 1'}, {name:'test server 2'}, {name:'test server 3'}]);
};

exports.get = function(req, res) { // etc
  
}