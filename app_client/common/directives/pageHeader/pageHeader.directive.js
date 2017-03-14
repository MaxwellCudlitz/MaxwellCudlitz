(function () {
	angular
	.module('loc8rApp')
	.directive('pageHeader', pageHeader);
	function pageHeader () {
		return {
			restrict: 'EA',
			scope: {
				// gets content from the template; passes through 'content' object.
				// isolates scope.
				content : '=content'
			},
			templateUrl: '/common/directives/pageHeader/pageHeader.template.html'
		};
	}
})();	