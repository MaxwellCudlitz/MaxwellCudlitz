var express = require('express');
var router = express.Router();
var ctrlMain = require('../controllers/main')

/* GET home page. */
// routes pattern of home page to exposed func in main
router.get('/', ctrlMain.index);

router.get('/test', function(req, res, next) {
	res.render('index', {title: 'test'});
});
module.exports = router;
