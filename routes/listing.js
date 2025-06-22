const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { listingSchema }  = require("../schema.js");
const ExpressError = require("../utils/expressError.js");
const Listing = require("../models/listing");
const { isLoggedIn } = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const ListingController = require("../controllers/listing.js");
const multer = require('multer');
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

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

//Index rout 
router
     .route("/")
    .get(wrapAsync(ListingController.index))
    .post( isLoggedIn, 
       upload.single('listing[image]'),
        validateListing,
         wrapAsync(ListingController.createListing));
    // .post(upload.single('listing[image]'), (req, res) => {
    //     res.send(req.file);
    // });

//New route
router.get("/new", isLoggedIn, ListingController.renderNewForm );

//Show route
router
   .route("/:id")
    .get(wrapAsync(ListingController.showListing))
    .put(isLoggedIn,isOwner, validateListing, (ListingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(ListingController.destroyListing));

//Create route
// router.post("/",validateListing, isLoggedIn,  wrapAsync(ListingController.createListing));

//Edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.renderEditForm));


module.exports = router;