const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");

main().then( () => {
        console.log("connected to mongoose");
}).catch((err) => {
    console.log(err);
});

async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/tour")
}

// app.use((req, res, next) => {
//     res.locals.success = req.flash("success");
// });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

const sessionOptions = {
    secret: "mysupersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge:  7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};

app.use(session(sessionOptions));
app.use(flash());

app.use((req, res, next) => {
    res.locals.message = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});


//New route
app.get("/listings/new", (req, res) => {
    res.render("listings/new.ejs");
});

// For express routes
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