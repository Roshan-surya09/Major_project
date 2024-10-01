const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema, reviewSchema }  = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing");


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


//Show route
router.get("/:id",wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
}));

//Create route
router.post("/",validateListing, wrapAsync(async(req, res, next) => {
        let newListing = new Listing(req.body);
        await newListing.save();
        res.redirect("/listings");
}));

//update route
router.put("/:id", validateListing, wrapAsync(async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
}));

//Edit route
router.get("/:id/edit",wrapAsync(async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",  { listing });
}));

//Index rout 
router.get("/",wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//Delete route
router.delete("/:id",wrapAsync(async(req, res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");
}));

module.exports = router;