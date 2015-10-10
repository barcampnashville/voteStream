angular.module('BarcampApp')
	.filter('myFavorites', function () {
		return function (items) {
			return items.filter(function (item) {
				return item.favorites;
			});
		}
	})
;
