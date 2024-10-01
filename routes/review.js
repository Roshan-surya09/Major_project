const express = require("express");
const router = express.Router({ mergeParams: true });
const Review = require("../models/review.js");
const Listing = require("../models/listing");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { reviewSchema }  = require("../schema.js");



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


//for review route
router.post("/",reviewValidate, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

//Delete review route
router.delete("/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    console.log(reviewId);
}));

module.exports = router;