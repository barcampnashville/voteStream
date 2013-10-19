
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send([{title:'test server 1'}, {title:'test server 2'}, {title:'test server 3'}]);
};

exports.get = function(req, res) { // etc
  
}