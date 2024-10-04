const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");

router.get("/signup", (req, res) => {
   res.render("users/signup.ejs");
});

router.post("/signup",async(req, res) => {
   try {
      let { username , email, password } = req.body;
      const newUser = await new User({ email, username });
      const registerUser = await User.register(newUser, password);
      console.log(registerUser);
      req.login(registerUser, (err) => {
         if(err){
          return next(err);
         }
         req.flash("success", "New user sign-up !!");
         res.redirect("/listings");
      });     
   } catch (error) {
       req.flash("error", "Please check user already exist !" )
      res.redirect("/signup");
   } 
});

router.get("/login", (req, res) => {
   res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl, passport.authenticate("local",
    { failureRedirect : "/login", failureFlash: true}), 
    async(req, res) => {
      req.flash("success", "welcome back to wanderlust !!" );
      let redirect = res.locals.redirectUrl || "/listings";
      res.redirect(redirect);
});

router.get("/logout", (req, res, next) => {
   req.logout((err) => {
      if(err){
      return next(err);
      }
      req.flash("success", "You are log-out to wonderlust !!");
      res.redirect("/listings");
   });
});

module.exports = router;