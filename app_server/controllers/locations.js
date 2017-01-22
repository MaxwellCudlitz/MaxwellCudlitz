//- google maps api key: AIzaSyBRgppn_Dr9Nd0gdMR1kk1BMTeuG5TK2ao


module.exports.homelist = function(req, res){
	res.render('locations-list', {
		title: 'Loc8r- find a place to work with wifi',
		pageHeader:{
			title: 'Loc8r',
			strapline: 'find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake, or a pint? Let Loc8r help you find the place you're looking for.",
		locations:[
		{
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
	res.render('location-info', {
		title: 'Starcups',
		pageHeader:{title: 'Starcups'},
		sidebar:{
			context: 'is on Loc8r because it has fast wifi and space to sit down with your laptop.',
			callToAction: 'If you\'ve been there and you liked it, or you didn\'t, please leave a review to let others know and improve our service!'
		},
		location:{
			rating: 4,
			address: '125 High Street, Reading, RG6 1PS',
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			coords: {lat: 51.455041, lng: -0.9690884},
			openingTimes: [
			{
				days: 'Monday-Friday',
				opening: '7:00am',
				closing: '7:00pm',
				closed: false
			},{
				days: 'Saturday',
				opening: '8:00am',
				closing: '5:00pm',
				closed: false
			},{
				days: 'Sunday',
				closed: true
			}],
			reviews:[
			{
				author: 'Simon Holmes',
				rating: 5,
				timestamp: '16 July 2023',
				reviewText: 'What a great place. I can\'t say enough about it!'
			},{
				author: 'Charlie Chaplin',
				rating: 3,
				timestamp: '16 June 2023',
				reviewText: 'Good wifi, bad coffee.'
			}]
		}
	});
};

module.exports.addReview = function(req, res){
	res.render('location-review-form', {
		title : "Review Starcups on Loc8r",
		pageHeader: {title: 'Review Starcups'}
	});
};