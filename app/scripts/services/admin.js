'use strict';

app.factory('Admin', function ($http, $q, Constants) {

  const obj = {selected: true};
  
  const selectSessions = indexArr => {
    $q.all(
      indexArr.map( i => $http.patch(`${Constants.firebaseUrl}/Sessions/${i}.json`, obj).catch( err => console.log('err', err)))
    ).catch( err => console.log('err', err))
  };

  return { selectSessions };

});
