const passport = require("passport");
const googleAuthenticateCallback = (req, res, next) => {
  passport.authenticate("google", (err, user, info) => {
    if (err) {
      return res.render("auth/login", {
        message: err,
      });
    }
    if (!user) {
      return res.render("auth/login", {
        message: "Sign in with Google failed",
      });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      return res.redirect("/");
    });
  })(req, res, next);
};

module.exports = { googleAuthenticateCallback };
