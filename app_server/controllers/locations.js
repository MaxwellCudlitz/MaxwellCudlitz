//- google maps api key: AIzaSyBRgppn_Dr9Nd0gdMR1kk1BMTeuG5TK2ao

var request = require('request');
var apiOptions = {
	server : "http://localhost:3000"
};
if(process.env.NODE_ENV === 'production'){
	apiOptions.server = "https://nameless-hollows-66274.herokuapp.com/";
}

/*
var requestOptions = {
	url : "https://nameless-hollows-66274.herokuapp.com/",
	method : "GET",
	json : {},
	qs : {
		offset : 20
	}
};

// make request
request(requestOptions, function(err, response, body) {
	if(err){
		console.log(err);
	} else if (response.statusCode === 200){
		console.log(body);
	} else {
		console.log(response.statusCode);
	}
});
*/

var renderHomepage = function(req, res){
  res.render('locations-list', {
    title: 'Loc8r - find a place to work with wifi',
    pageHeader: {
      title: 'Loc8r',
      strapline: 'Find places to work with wifi near you!'
    },
    sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Have coffee, a sandwich, or a slice of pie while writing code and pushing your commits! Let Lo8r help you find the place you're looking for."
  });
};

module.exports.homelist = function(req, res){
	renderHomepage(req, res);
};

// copied from Tony Mullen's repo; instructions in chapter notes
var _formatDistance = function(distance) {
  var numDistance, unit;
  if (distance >= 1000) {
    numDistance = parseFloat((distance/1000).toFixed(1));
    unit = ' km';
  } else {
    numDistance = parseInt(distance, 10);
    unit = ' m';
  }
  return numDistance + unit;
}

var renderDetailPage = function(req, res, locDetail){
	res.render('location-info', {
		title: locDetail.name,
		pageHeader:{title: locDetail.name},
		sidebar:{
			context: 'is on Loc8r because it has fast wifi and space to sit down with your laptop.',
			callToAction: 'If you\'ve been there and you liked it, or you didn\'t, please leave a review to let others know and improve our service!'
		},
		location: locDetail

/*
		{
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
		*/
	});
}

module.exports.locationInfo = function(req, res){
	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server	+ path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body){
			var data = body;
			if(response.statusCode === 200){
				data.coords = {
					lng : body.coords[0],
					lat : body.coords[1]
				}
			} else {
				_showError(req, res, response.statusCode)
			}
			
			renderDetailPage(req, res, data);
		});
	
};

var renderReviewForm = function(req, res, locDetail){
	res.render('location-review-form', {
		title: 'Review ' + locDetail.name + ' on Loc8r',
		pageHeader : {title : 'Review' + locDetail.name},
		error : req.query.err,
		url : req.originalUrl
	});
};

module.exports.doAddReview = function(req, res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = '/api/locations/' + locationid + '/reviews';
	postdata = {
		author : req.body.name,
		rating : parseInt(req.body.rating, 10),
		reviewText : req.body.review
	};
	requestOptions = {
		url : apiOptions.server + path,
		method : 'POST',
		json : postdata
	};
	if(!postdata.author || !postdata.rating || !postdata.reviewText){
		res.redirect('/location/' + locationid + '/review/new?err=val');
	} else {
		request(
		requestOptions,
		function(err, response, body){
			if(response.statusCode === 201){
				res.redirect('/location/' + locationid);
			} else if (response.statusCode === 400 && body.name && body.name === "ValidationError"){
				res.redirect('/location/' + locationid + '/review/new?err=val');
			}
			else {
				_showError(req, res, response.statusCode);
			}
		});
	}
	
};

var getLocationInfo = function(req, res, callback){
	var requestOptions, path;
	path = '/api/locations/' + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : 'GET',
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body){
			var data = body;
			if(response.statusCode === 200){
				data.coords = {
					lng : body.coords[0],
					lat : body.coords[1]
				};
				callback(req, res, data);
			} else {
				_showError(req, res, response.statusCode);
			}
		}
	);
};

module.exports.locationInfo = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData){
		renderDetailPage(req, res, responseData);
	});
};

module.exports.addReview = function(req, res){
	getLocationInfo(req, res, function(req, res, responseData){
		renderReviewForm(req, res, responseData);
	});
};

var _showError = function (req, res, status) {
  var title, content;
  if (status === 404) {
    title = "404; page not found";
    content = "Not found :(";
  } else if (status === 500) {
    title = "500; internal server error";
    content = "There's a problem with our server, please send an email to maxwell.cudlitz@gmail.com if this persists.";
  } else {
    title = status + "Something's gone wrong";
    content = "Something, somewhere, has gone just a little (or very) wrong. Please send an email to maxwell.cudlitz@gmail.com if this persists.";
  }
  res.status(status);
  res.render('generic-text', {
    title : title,
    content : content
  });
};