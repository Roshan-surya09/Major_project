const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema }  = require("./schema.js");
const Review = require("./models/review.js");

main().then( () => {
        console.log("connected to mongoose");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tour")
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

//for new listing
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if(error){
        let newMsg = error.details.map((el) => el.message).join(",");
        // console.log(newMsg);
        throw new ExpressError(400, newMsg);
    }else{
        next();
    };
};

// For review
const reviewValidate = (req, res, next) => {
    let { error } = reviewSchema.validate(req.body);
    if(error){
        let newMsg = error.details.map((el) => el.message).join(",");
        // console.log(newMsg);
        throw new ExpressError(400, newMsg);
    }else{
        next();
    };
};

//Show route
app.get("/listings/:id",wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create route
app.post("/listings",validateListing, wrapAsync(async(req, res, next) => {
        let newListing = new Listing(req.body);
        await newListing.save();
        res.redirect("/listings");
}));

//update route
app.put("/listings/:id", validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Edit route
app.get("/listings/:id/edit",wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",  { listing });
}));

//Index rout 
app.get("/listings",wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Delete route
app.delete("/listings/:id",wrapAsync(async(req, res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

//Home route
app.get("/", (req, res) => {
    res.send("Hii I am root");
});

// const review = async() => {
//     let review1 = new Review({
//         comment: 'nice place',
//         rating: 1,
//     });

//     await review1.save();
//     console.log("review data saved");
// };
//    review();


//for review route
app.post("/listings/:id/reviews",reviewValidate, wrapAsync(async(req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    
    res.redirect(`/listings/${listing._id}`);
}));

//Delete review route
app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: { reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
    console.log(reviewId);
}));

// app.get("/test", async (req, res) => {
//    let sampleListing = new Listing({
//     title: "my Home",
//     description: "sweet home",
//     price: 200000,
//     location: "sarkanda",
//     country: "India",
//    });
    
//    await sampleListing.save();
//    console.log("sample was saved");
//    res.send("successfull testing");
// });

app.all("*", (req, res, next) => {
    next( new ExpressError(404, "Page not found!"));
});

//Error handling middlewar
app.use((err, req, res, next) => {
    let { status=404 , message="Page not found"} = err;
    res.status(status).render("error.ejs", { message});
    // res.status(status).send(message);
});

app.listen(8080, ()=> {
    console.log("Server is listning on port 8080");
});