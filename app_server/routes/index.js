var express = require('express');
var router = express.Router();

var ctrlLocations = require('../controllers/locations')
var ctrlOthers = require('../controllers/others')

/*location routes*/
router.get('/', ctrlLocations.homelist);
router.get('/location/:locationid', ctrlLocations.locationInfo);
router.get('/location/review/new', ctrlLocations.addReview);

/*other routes*/
router.get('/about', ctrlOthers.about);

module.exports = router;
