'use strict';

app.factory('Polling', function ($http) {

	const getPollingPeriods = () => {
		return $http.get(`https://nashvillebarcamp.firebaseio.com/PollingState.json`)
			.then(data => {
				let periods = data.data.pollingPeriods;
				return determineSession(periods);
		})
	}

	const determineSession = (periods) => {

		let morning = periods[0];
		let afternoon = periods[1];
		afternoon.endTime = '13:15pm' //TODO: Remove am/pm change compareTime

		if (compareTime(morning)) {
			return {open: true, sessions: 'morning'}
		}
		else if (compareTime(afternoon)) {
			return {open: true, sessions: 'afternoon'}
		} else {
			return {open: false, sessions: ''}
		}
	}

	const compareTime = (period) => {

		const start = period.startTime.slice(0, -2).split(':'); // ["8", "00"] 
		const end = period.endTime.slice(0, -2).split(':'); // ["9", "15"]

		const startTime = new Date().setHours(start[0], start[1]);
		const endTime = new Date().setHours(end[0], end[1]);

		const diff1 = startTime - (new Date()).getTime();	
		const diff2 = endTime - (new Date()).getTime();
	
		if(diff1 < 0 && diff2 > 0 ) 
		{
		    return true;
		} else {

			return false;
		}

	}

	return {getPollingPeriods}

});