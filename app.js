const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");


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

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

//Home route
app.get("/", (req, res) => {
    res.send("Hii I am root");
});

//for all route handler
app.all("*", (req, res, next) => {
    next( new ExpressError(404, "Page not found!"));
});

//Error handling middlewar
app.use((err, req, res, next) => {
    let { status=404 , message="Page not found"} = err;
    res.status(status).render("error.ejs", { message});
});

app.listen(8080, ()=> {
    console.log("Server is listning on port 8080");
});