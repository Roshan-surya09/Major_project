const express = require("express")
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

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

//Show route
app.get("/listings/:id", async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
});

//Create route
app.post("/listings", async(req, res) => {
    let newListing = new Listing(req.body);
    await newListing.save();
    res.redirect("/listings");
});

//update route
app.put("/listings/:id", async(req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect("/listings");
});

//Edit route
app.get("/listings/:id/edit", async(req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",  { listing });
});

//Index rout 
app.get("/listings", async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
});

//Delete route
app.delete("/listings/:id", async(req, res) => {
    let { id } = req.params;
   let deletedListing = await Listing.findByIdAndDelete(id);
   console.log(deletedListing);
   res.redirect("/listings");

});

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

app.get("/", (req, res) => {
    res.send("Hii I am root");
});

app.listen(8080, ()=> {
    console.log("Server is listning on port 8080");
});