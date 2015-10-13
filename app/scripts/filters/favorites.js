angular.module('BarcampApp')
	.filter('myFavorites', function () {
		return function (items, userFavorites) {
			// console.log(userFavorites);
			return items.filter(function (item) {
				userFavorites.forEach(function (favorite) {
					if (favorite.nid === item.nid) {
						// console.log(item.nid + ": true");
					  return item;
					}
					// console.log(item.nid + ": false");
				});
			});
		}
	})
;
