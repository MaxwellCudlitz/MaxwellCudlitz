var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

var theEarth = (function () {

    var earthRadius = 6371;

    var getDistanceFromRads = function (rads) {
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function (distance) {
        return parseFloat(distance / earthRadius);
    };

    return {
        getDistanceFromRads: getDistanceFromRads,
        getRadsFromDistance: getRadsFromDistance
    };
});

// get list of locations, sorted by distance. Catches errors.
// returns JSON responses.
module.exports.locationsListByDistance = function (req, res) {

    // using the lat+lng data and the theEarth function, determines the 
    // distance
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    var maxDistance = parseFloat(req.query.maxDistance);
    var point = {
        type: "Point",
        coordinates: [lng, lat]
    };
    var geoOptions = {
        spherical: true,
        maxDistance: theEarth.getRadsFromDistance(maxDistance),
        num: 10
    };
    if(!lng || !lat){
        sendJsonResponse(res, 404, {
            "message" : "lng and lat prams are required for a search!"
        });
        return;
    }

    // lambda def
    Loc.geoNear(point, geoOptions, function(err, results, stats) {
        var locations = [];

        // if there was an error, throw and return
        if(err){
            sendJsonResponse(res, 404, err);
        } 
        // else iterate over results in doc && respond
        else {
            results.forEach(function(doc) {
                locations.push({
                    distance: theEarth.getDistanceFromRads(doc.dis),
                    name: doc.obj.name,
                    address: doc.obj.address,
                    rating: doc.obj.rating,
                    facilities: doc.obj.facilities,
                    _id: doc.obj._id
                });
            });
            sendJsonResponse(res, 200, locations);
        }
    });
};

// creates a location, stores it in the database as a document.
// Accessible through the REST Api.
module.exports.locationsCreate = function(req, res) {

    // creates the location object using the schema
    // - schema additionally ensures proper formatting
    // and handles malformed request security.
    // TODO: Check on mongodb rules for strict document formation(?) Could be an attack vector for DOS with large BLOB file
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities: req.body.facilities.split(","),
        coords: [parseFloat(req.body.lng), parseFloat(req.body.lat)],
        openingTimes: [{
            days: req.body.days1,
            opening: req.body.opening1,
            closing: req.body.closing1,
            closed: req.body.closed1,
        }, {
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, 
    // callback function that informs client of success/failure
    function(err, location) {
        if (err) {
            sendJsonResponse(res, 400, err);
        } else {
            sendJsonResponse(res, 201, location);
        }
    });
};

// reads one location from the database.
module.exports.locationsReadOne = function (req, res) {

    if (req.params && req.params.locationid) {
        // req.params.locationid; locationid field of URL resolved as a string (id),
        // and passed to database.
        Loc.findById(req.params.locationid)
            // Executes the query, defined by an anonymous function that takes an err callback +
            // the location object, defined by exec( err: any, res: Document)
            .exec(function (err, location) {
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "locationid not found" });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                // sends a json response with the location JSON
                sendJsonResponse(res, 200, location);
            });
        } else {
        // if no locationid was present (no req.params OR requ.params.locationid)
        sendJsonResponse(res, 404, { "message": "No locationid in request" });
    }

};

module.exports.locationsUpdateOne = function(req, res) {

    // if there is no locationid provided, 404
    if (!req.params.locationid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid is required"
        });
        return;
    }


    Loc
        // locate the location in the database
        .findById(req.params.locationid)
        // do not select reviews, or ratings
        .select('-reviews -rating')
        .exec(
            function(err, location) {
                // if no location, 404
                if (!location) {
                    sendJsonResponse(res, 404, {
                        "message": "locationid not found"
                    });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 400, err);
                    return;
                }
                // set values
                location.name = req.body.name;
                location.address = req.body.address;
                location.facilities = req.body.facilities.split(",");
                location.coords = [parseFloat(req.body.lng),
                parseFloat(req.body.lat)];
                location.openingTimes = [{
                    days: req.body.days1,
                    opening: req.body.opening1,
                    closing: req.body.closing1,
                    closed: req.body.closed1,
                }, {
                    days: req.body.days2,
                    opening: req.body.opening2,
                    closing: req.body.closing2,
                    closed: req.body.closed2,
                }];
                // write to DB
                location.save(function(err, location) {
                    if (err) {
                        sendJsonResponse(res, 404, err);
                    } else {
                        sendJsonResponse(res, 200, location);
                    }
                });
            }
            );
    };


// deletes a review- good for automatic pruning of bad reviews
module.exports.locationsDeleteOne = function(req, res) {
    var locationid = req.params.locationid;
    // if location exists, prune it
    if (locationid) {
        Loc
        .findByIdAndRemove(locationid)
        .exec(
            function(err, location) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            }
            );
    } 
    // else, review does not exist, 404
    else {
        sendJsonResponse(res, 404, {
            "message": "No locationid"
        });
    }
};


// create a review
module.exports.reviewsCreate = function(req, res) {
    var locationid = req.params.locationid;
    if (locationid) {
        Loc
        .findById(locationid)
        .select('reviews')
        .exec(
            function(err, location) {
                if (err) {
                    sendJsonResponse(res, 400, err);
                } else {
                    doAddReview(req, res, location);
                }
            });
    } else {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid required"
        });
    }
};

module.exports.reviewsUpdateOne = function(req, res) {

    // 
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
        function(err, location) {
            var thisReview;
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            // Checks for list of review's existence + longer than 0 (contains review)
            if (location.reviews && location.reviews.length > 0) {
                thisReview = location.reviews.id(req.params.reviewid);
                if (!thisReview) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    thisReview.author = req.body.author;
                    thisReview.rating = req.body.rating;
                    thisReview.reviewText = req.body.reviewText;
                    location.save(function(err, location) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 200, thisReview);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, {
                    "message": "No review to update"
                });
            }
        }
        );
};

// adds review to db + returns new review in response
var doAddReview = function(req, res, location){

    // if no location found, return
    if(!location){
        sendJsonResponse(res, 400, {
            "message" : "locationid not found in database"
        });
    } 
    // push the data into the database
    else {

        // push the data
        location.reviews.push({
            author: req.body.author,
            rating: req.body.rating,
            reviewText : req.body.reviewText
        });

        // upon pushing, update the average rating,
        // and return it in the response
        location.save(function(err, location){
            var thisReview;
            if(err){
                sendJsonResponse(res, 400, err);
            } else {
                updateAverageRating(location._id);
                thisReview = location.reviews[location.reviews.length - 1];
                sendJsonResponse(res, 201, thisReview);
            }
        });
    }
}

// delete review, and modify average rating to reflect this change.
module.exports.reviewsDeleteOne = function(req, res) {
    if (!req.params.locationid || !req.params.reviewid) {
        sendJsonResponse(res, 404, {
            "message": "Not found, locationid and reviewid are both required"
        });
        return;
    }
    Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
        function(err, location) {
            if (!location) {
                sendJsonResponse(res, 404, {
                    "message": "locationid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            if (location.reviews && location.reviews.length > 0) {
                if (!location.reviews.id(req.params.reviewid)) {
                    sendJsonResponse(res, 404, {
                        "message": "reviewid not found"
                    });
                } else {
                    location.reviews.id(req.params.reviewid).remove();
                    location.save(function(err) {
                        if (err) {
                            sendJsonResponse(res, 404, err);
                        } else {
                            updateAverageRating(location._id);
                            sendJsonResponse(res, 204, null);
                        }
                    });
                }
            } else {
                sendJsonResponse(res, 404, {
                    "message": "No review to delete"
                });
            }
        }
        );
};

// calls doSetAverageRating on the given locationid
// after finding it. NOTE: Will silently fail (to end user)
var updateAverageRating = function(locationid) {
    Loc
    .findById(locationid)
    .select('rating reviews')
    .exec(
        function(err, location) {
            if (!err) {
                doSetAverageRating(location);
            }
        });
};

// actually update the average rating
var doSetAverageRating = function(location) {
    var i, reviewCount, ratingAverage, ratingTotal;
    if (location.reviews && location.reviews.length > 0) {
        reviewCount = location.reviews.length;
        ratingTotal = 0;
        for (i = 0; i < reviewCount; i++) {
            ratingTotal = ratingTotal + location.reviews[i].rating;
        }
        ratingAverage = parseInt(ratingTotal / reviewCount, 10);
        location.rating = ratingAverage;
        location.save(function(err) {
            if (err) {
                console.log(err);
            } else {
                console.log("Average rating updated to", ratingAverage);
            }
        });
    }
};



