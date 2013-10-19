exports.config = function(){
	return {
		votes: 3,
		voteables: [
			{
				id: 'vsa',
				title: 'Voting System App',
				people: ['Calvin Froedge', 'Ben Stucki', 'Hakan', 'Thomas', 'Beat', 'Paul'],
				description: 'An awesome voting system to be used for both HackNashville and BarCamp voting sessions.  Built with NodeJS and AngularJS.'
			},
			{
				id: 'obama',
				title: 'Obama',
				description: 'Obamacare'
			},
			{
				id: 'bootstrap',
				session_id: '8347',
				datetime: '',
				title: 'Bootstrap your responses',
				description: 'Bootstrap is an HTML5, CSS, and jquery framework for developing a responsive web site.',
				name_speaker: 'Joe Smith',
				isnfo_speaker: '',
				categories: { primary: 'Code', secondary: 'Design' },
				room: ''
			}
		]  //These are the things that can be voted on
	}
}