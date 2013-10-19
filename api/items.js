module.exports = function(config){
	return {
		list: function(req, res){
			console.log(config.voteables);
	    res.send(config.voteables);
		}
	}
}
