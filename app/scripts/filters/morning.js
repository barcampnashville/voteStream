angular.module('BarcampApp')
	.filter('morning', function () {
		return function (items) {
			return items.filter(function (item) {

              return item.availability.toLowerCase().indexOf('morning') > -1 && !item.inSync.removed;
			});
		}
	})
;
