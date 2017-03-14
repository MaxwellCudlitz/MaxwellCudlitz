( function () {
	angular
	.module('loc8rApp')
	.controller('homeCtrl', homeCtrl);

	// injects dependencies to ensure they are not minified
	homeCtrl.$inject = ['$scope', 'loc8rData', 'geolocation'];

	// takes loc8rData and geoLocation to serve pages w/ content
	function homeCtrl ($scope, loc8rData, geolocation) {

		var vm = this; 

		// ensures proper scope is maintained
		vm.pageHeader = {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		};
		vm.sidebar = {
			content: "Looking for wifi and a seat? Etc etc…"
		};

		// removes buffer text
		vm.message = "Checking your location";

		// copy of controller from previous chapter- but 
		// with proper scoping
		vm.getData = function (position) {
			var lat = position.coords.latitude,
			lng = position.coords.longitude;
			vm.message = "Searching for nearby places";
			loc8rData.locationByCoords(lat, lng)
			.success(function(data) {
				vm.message = data.length > 0 ? "" : "No locations found nearby";
				vm.data = { locations: data };
			})
			.error(function (e) {
				vm.message = "Sorry, something's gone wrong";
			});
		};

		// using scope because vm cannot access it's grandparent's fields
		vm.showError = function (error) {
			$scope.$apply(function() {
				vm.message = error.message;
			});
		};
		vm.noGeo = function () {
			$scope.$apply(function() {
				vm.message = "Geolocation is not supported by this browser.";
			});
		};

		geolocation.getPosition(vm.getData,vm.showError,vm.noGeo);
	} 
}) ();
