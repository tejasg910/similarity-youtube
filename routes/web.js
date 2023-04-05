const {
  registerController,
  loginController,
  registerUser,
  loginUser,
  isAuthenticated,
  checkLogin,
  logOut,
  checkAuthentication,
} = require("../app/http/controllers/authController");
const passport = require("passport");
const path = require("path");
const User = require("../app/models/User");
const {
  homePage,
  getAllItems,
  addToCart,
} = require("../app/http/controllers/homeController");
const {
  getCartItems,
  clearCart,
  getCartLength,
} = require("../app/http/controllers/customers/cartController");

const {
  getProfile,
} = require("../app/http/controllers/profile/profileController");
const { guest } = require("../app/http/middlewares/gues");

function initRoutes(app) {
  app.set("views", path.join(__dirname, "../resource/views"));
  app.get("/", homePage);

  app.get("/register", guest, registerController);
  app.get("/login", guest, loginController);
  app.get("/cart", isAuthenticated, getCartItems);

  app.post("/login", loginUser);
  app.get("/logout", logOut);
  app.post("/register", registerUser);

  app.post("/add-to-cart", checkAuthentication, addToCart);
  app.get("/clear-cart", isAuthenticated, clearCart);
  app.get("/check-login", checkLogin);
  app.get("/get-cart-length", isAuthenticated, getCartLength);
  app.get("/profile", isAuthenticated, getProfile);
  // Route to initiate Google authentication
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  // Route to handle Google authentication callback
  app.get("/auth/google/callback", (req, res, next) => {
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
  });
}

module.exports = initRoutes;
