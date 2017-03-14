(function () {

  angular.module('loc8rApp', ['ngRoute']);

  // little bug fix for stupid user scenarios
  if (window.location.pathname !== '/') {
    window.location.href = '/#' + window.location.pathname;
  } 

  function config ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'home/home.view.html',
        controller: 'homeCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: '/common/views/genericText.view.html',
        controller: 'aboutCtrl',
        controllerAs: 'vm'
      })
      .otherwise({redirectTo: '/'});

      $locationProvider.html5Mode({enabled: true, requireBase: false});
  }

  angular
    .module('loc8rApp')
    .config(['$routeProvider','$locationProvider', config]);

})();