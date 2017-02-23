var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJsonResponse = function (res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.reviewsReadOne = function (req, res) {
    if (req.params && req.params.locationid && req.params.reviewid) {
        Loc
            // finds the content by it's ID
            .findById(req.params.locationid)
            // select only names && reviews (space deliniated)
            .select('name reviews')
            .exec(function (err, location) {
                var response, review;
                // if the location does not exist, or there is an error, exit early.
                if (!location) {
                    sendJsonResponse(res, 404, { "message": "locationid not found" });
                    return;
                } else if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                // if there exist reviews, and the number is > 0, query.
                if (location.reviews && location.reviews.length > 0) {
                    ///
                    /// not properly retrieving reviews.
                    ///
                    review = location.reviews.id(req.params.reviewid);

                    //  this line used for debugging
                    //  sendJsonResponse(res, 200, location.reviews)r;
                    //  return;

                    if (!review) {
                        sendJsonResponse(res, 404, { "message": "reviewid not found" });
                    } else {
                        // formats response JSON
                        response = {
                            location: {
                                name: location.name, _id: req.params.locationid
                            },
                            review : review
                        };
                        sendJsonResponse(res, 200, response);
                    }
                } else {
                    sendJsonResponse(res, 400, { "message": "No reviews found" });
                }
            });
    } else {
        sendJsonResponse(res, 404, {"message" : "Not found, locationid and reviewid are both required"});
    }
};

module.exports.reviewsCreate = function (req, res) {
    sendJsonResponse(res, 201, { "status": "success" });
};

module.exports.reviewsUpdateOne = function (req, res) {
    sendJsonResponse(res, 201, { "status": "success" });
};

module.exports.reviewsDeleteOne = function (req, res) {
    sendJsonResponse(res, 204, { "status": "success" });
};