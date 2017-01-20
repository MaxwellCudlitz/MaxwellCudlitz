
// exposes this func so that it may be called from the router
module.exports.index = function(req, res){
	res.render('index', {title:'Express'});
};