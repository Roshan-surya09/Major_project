const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

module.exports.showListing = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate({path : "reviews",
        populate: {path: "author"},
    })
    .populate("owner");
    if(! listing){
        req.flash("error", "The listing you find is dones not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};

module.exports.createListing = async(req, res, next) => {
        let url = req.file.path;
        let filename = req.file.filename;
        let newListing = new Listing(req.body.listing);
        newListing.owner = req.user._id;
        newListing.image = { url, filename };
        await newListing.save();
        req.flash("success", "New listing added successfully !!");
        res.redirect("/listings");
};

module.exports.renderEditForm = async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(! listing){
        req.flash("error", "The listing you find is doesn't exist");
        res.redirect("/listings");
    }
    req.flash("success", "Edit listing successfully !!");

     let originalImageUrl = listing.image.url;
     originalImageUrl =  originalImageUrl.replace("/upload", "/upload/w_250");
    res.render("listings/edit.ejs",  { listing, originalImageUrl });
};

module.exports.updateListing = async(req, res) => {
    let { id } = req.params;
   let listing =  await Listing.findByIdAndUpdate(id, {...req.body.listing});

   if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { url, filename };
    await listing.save();
   }
    req.flash("success", "Listing updated successfully !!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async(req, res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   req.flash("success", "Listing deleted successfully !!");

   console.log(deletedListing);
   res.redirect("/listings");
};

