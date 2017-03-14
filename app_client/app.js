(function () { // open IIFE
	// is actualy angular routing
	angular.module('loc8rApp', ['ngRoute']);

	// configures routing for SPA
	function config ($routeProvider) {
		$routeProvider
		.when('/', {
		// point to new template
		templateUrl: 'home/home.view.html',
		controller: 'homeCtrl',
		controllerAs: 'vm'
		})
		.otherwise({redirectTo: '/'});
	}

	angular
	.module('loc8rApp')
	.config(['$routeProvider', config]);
}) (); // close and invoke