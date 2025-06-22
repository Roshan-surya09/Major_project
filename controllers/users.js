const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
   res.render("users/signup.ejs");
};

module.exports.signup = async(req, res) => {
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
};

module.exports.renderLoginForm = (req, res) => {
   res.render("users/login.ejs");
};

module.exports.login = async(req, res) => {
      req.flash("success", "welcome back to wanderlust !!" );
      let redirect = res.locals.redirectUrl || "/listings";
      res.redirect(redirect);
};

module.exports.logout = (req, res, next) => {
   req.logout((err) => {
      if(err){
      return next(err);
      }
      req.flash("success", "You are log-out to wonderlust !!");
      res.redirect("/listings");
   });
};