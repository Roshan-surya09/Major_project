const Review = require("./models/review");
const Listing = require("./models/listing");

module.exports.isLoggedIn = (req, res , next) => {
    if (!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged into create listing !!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res , next )=> {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner = async( req, res, next) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error", "You don't have permission.");
       return res.redirect(`/listings/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    let {id, reviewId} = req.params;
    let review = await Review.findById(reviewId);
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error", "You are not the outhor of this listing")
        return res.redirect(`/listing${id}`);
    }

    next();
}

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
