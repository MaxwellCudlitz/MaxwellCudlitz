(function() {

  angular
    .module('loc8rApp')
    .service('loc8rData', loc8rData);

  loc8rData.$inject = ['$http'];
  function loc8rData ($http) {
    var locationByCoords = function (lat, lng) {
      return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=2000000000000');
    };

    var addReviewById = function (locationid, data) {
      return $http.post('/api/locations/' + locationid + '/reviews', data);
    };

    var locationById = function (locationid) {
        return $http.get('/api/locations/' + locationid);
      };

      return {
        locationByCoords : locationByCoords,
        locationById : locationById,
        addReviewById : addReviewById
      };
  }

})();