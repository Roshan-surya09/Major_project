const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema }  = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");

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

//New route
router.get("/new", isLoggedIn,  (req, res) => {
    res.render("listings/new.ejs");
});

//Show route
router.get("/:id",wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(! listing){
        req.flash("error", "The listing you find is dones not exist");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
}));

//Create route
router.post("/",validateListing, isLoggedIn,  wrapAsync(async(req, res, next) => {
        let newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success", "New listing added successfully !!");
        res.redirect("/listings");
}));

//update route
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    req.flash("success", "Listing updated successfully !!");
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit", isLoggedIn, wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(! listing){
        req.flash("error", "The listing you find is doesn't exist");
        res.redirect("/listings");
    }
    req.flash("success", "Edit listing successfully !!");

    res.render("listings/edit.ejs",  { listing });
}));

//Index rout 
router.get("/",wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Delete route
router.delete("/:id",isLoggedIn, wrapAsync(async(req, res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing deleted successfully !!");

   console.log(deletedListing);
   res.redirect("/listings");
}));

module.exports = router;