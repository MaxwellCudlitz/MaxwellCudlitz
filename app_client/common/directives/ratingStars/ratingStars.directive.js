(function(){
	angular
	.module('loc8rApp')
	.directive('ratingStars', ratingStars);

	function ratingStars () {
		return {
			restrict: 'EA',	// restricts usage; must be it's own element or an element
			scope: {
				thisRating : '=rating'
			},
			templateUrl: '/common/directives/ratingStars/ratingStars.template.html'
		};
	}
})();
