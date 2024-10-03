const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");

router.get("/signup", (req, res) => {
   res.render("users/signup.ejs");
});

router.post("/signup",async(req, res) => {
   try {
      let { username , email, password } = req.body;
      const newUser = await new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.flash("success", "New user sign-up !!");
      res.redirect("/listings");

   } catch (error) {
       req.flash("error", "Please check user already exist !" )
      res.redirect("/signup");
   } 
});

router.get("/login", (req, res) => {
   res.render("users/login.ejs");
});

router.post("/login",passport.authenticate("local",
    { failureRedirect : "/login", failureFlash: true}), 
    async(req, res) => {
      req.flash("success", "welcome back to wanderlust" );
      res.redirect("/listings");
});

module.exports = router;