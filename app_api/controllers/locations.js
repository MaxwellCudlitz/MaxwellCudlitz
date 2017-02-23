var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function(res, status, content){
    res.status(status);
    res.json(content);
};

var theEarth = (function(){

    var earthRadius = 6371;

    var getDistanceFromRads = function(rads){
        return parseFloat(rads * earthRadius);
    };

    var getRadsFromDistance = function(distance){
        return parseFloat(distance / earthRadius);
    };

    return{
        getDistanceFromRads : getDistanceFromRads,
        getRadsFromDistance : getRadsFromDistance
    };
});

// reads one location from the database.
module.exports.locationsReadOne = function(req, res) {
    
    if(req.params && req.params.locationid){
        // req.params.locationid; locationid field of URL resolved as a string (id),
        // and passed to database.
        Loc.findById(req.params.locationid)
            // Executes the query, defined by an anonymous function that takes an err callback +
            // the location object, defined by exec( err: any, res: Document)
            .exec(function(err, location){
                if(!location){
                    sendJsonResponse(res, 404, {"message" : "locationid not found"});
                    return;
                } else if (err){
                    sendJsonResponse(res, 404, err);
                    return;
                }
                // sends a json response with the location JSON
                sendJsonResponse(res, 200, location);
            });
    } else {
        // if no locationid was present (no req.params OR requ.params.locationid)
        sendJsonResponse(res, 404, {"message" : "No locationid in request"});
    }
    

};

module.exports.locationsCreate = function(req, res) {
    sendJsonResponse(res, 200, {"status" : "success"});
};

module.exports.locationsListByDistance = function(req, res) {
    sendJsonResponse(res, 201, {"status" : "success"});
};

module.exports.locationsUpdateOne = function(req, res){
    sendJsonResponse(res, 201), {"status" : "success"};
};
module.exports.locationsDeleteOne = function(req, res){
    sendJsonResponse(res, 204), {"status" : "success"};
};