module.exports.homelist = function(req, res){
	res.render('locations-list', {
		title : 'Loc8r- find a place to work with wifi',
		pageHeader:{
			title: 'Loc8r',
			strapline: 'find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for.",
		locations: 
		[{
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
			distance: '100m'
		},{
			name: 'Cafe Hero',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 4,
			facilities: ['Hot drinks', 'Food', 'Premium Wifi'],
			distance: '100m'
		},{
			name: 'Burger Queen',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 2,
			facilities: ['Food', 'Business Wifi'],
			distance: '100m'
		}]
	});
};

module.exports.locationInfo = function(req, res){
	res.render('location-info', {title : "Location Info"});
};

module.exports.addReview = function(req, res){
	res.render('location-review-form', {title : "Add Review"});
};