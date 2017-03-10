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

// get list of locations
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

module.exports.locationsCreate = function (req, res) {
    sendJsonResponse(res, 200, { "status": "success" });
};

module.exports.locationsListByDistance = function (req, res) {
    sendJsonResponse(res, 201, { "status": "success" });
};

module.exports.locationsUpdateOne = function (req, res) {
    sendJsonResponse(res, 201), { "status": "success" };
};
module.exports.locationsDeleteOne = function (req, res) {
    sendJsonResponse(res, 204), { "status": "success" };
};