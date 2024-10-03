const express = require("express");
const app = express();
const users = require("./routes/user.js");
const post = require("./routes/post.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(flash());


const sessionOperation = {
    secret : "secretstring", 
    resave : false,
     saveUninitialized: true 
}

app.use(session(sessionOperation));
app.use((req, res, next) => {
    res.locals.message = req.flash("info");
    res.locals.error = req.flash("error");
    next();
})

app.get("/register", (req, res) => {
    let { name = "anonymous" } =  req.query;
    req.session.name = name;
    if(name === "anomymous"){
        req.flash("error", "user not registered ");
    }else{
     
        req.flash("info", "user registered successfully !!");
    }
    res.redirect("/hello");
});

app.get("/hello", (req, res) => {
    res.render("page.ejs", { name : req.session.name});
});

// app.get("/circle", (req, res) => {
//     let { name = "anonymouse" } = req.query;
//     req.session.name = name;
//     req.flash("info", "user registered successfully !!");
//     res.redirect("/whatsUp")
//     console.log(req.session.name);

// });

// app.get("/whatsUp", (req, res) => {
//     res.locals.msg = req.flash("info");
//     res.render("circle.ejs", { name : req.session.name});
// });

// app.get("/reqcount", (req, res) => {
//     if(req.session.count){
//         req.session.count++;
//     }else{
//         req.session.count = 1;
//     }

//     res.send(`you sent a reqest ${req.session.count} times`);
// });

// app.use(cookieParser("secretcode"));
// app.use("/users", users);
// app.use("/post", post);

// //for cookeie

// app.get("/singedCookie", (req, res) => {
//     res.cookie("vegetable", "cabbage", {signed : true });
//     res.send("singned cookie sended");
// });

// app.get("/greet", (req, res) => {
//     let { color = "Not define" }  = req.cookies;
//     res.send(`the color is ${color}`);
// });

// app.get("/getCookie", (req, res) => {
//     res.cookie("greet", "namaste" , {signed : true });
//     res.cookie("made_in", "india");
//     res.send("our cookie was sended");
// });

// app.get("/varify", (req, res) => {
//     console.log(req.signedCookies);
//     res.send("send ");
// });

// app.get("/", (req, res) => {
//     console.dir(req.cookies);
//     res.send("root route");
// });


app.listen("3000", ()=> {
    console.log(" server listening on port 3000 ");
});