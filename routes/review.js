const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema }  = require("../schema.js");
const { isLoggedIn, isOwner, isReviewAuthor } = require("../middleware.js");
const reviewController = require("../controllers/review.js");



// For review
const reviewValidate = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let newMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, newMsg);
    }else{
        next();
    };
};

//for post review route
router.post("/",isLoggedIn ,reviewValidate, wrapAsync(reviewController.createReview));

//Delete review route
router.delete("/:reviewId",isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports = router;