module.exports = function(sio){
	return {
		vote: function(req, res){
			sio.sockets.emit('vote cast', req.params.id);
			res.send('ok');
		},
		results: function(req, res){
			res.json([
				{
					id: 'vsa',
					title: 'Voting System App',
					votes: 10
				}
			]);
		}
	}
}
