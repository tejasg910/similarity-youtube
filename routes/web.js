const {
  registerController,
  loginController,
  registerUser,
  loginUser,
  isAuthenticated,
  checkLogin,
  logOut,
} = require("../app/http/controllers/authController");

const path = require("path");
const User = require("../app/models/User");
const {
  homePage,
  getAllItems,
  addToCart,
} = require("../app/http/controllers/homeController");
const getCartItems = require("../app/http/controllers/customers/cartController");

function initRoutes(app) {
  console.log(path.join(__dirname, "../resource/views"));
  app.set("views", path.join(__dirname, "../resource/views"));
  app.get("/", homePage);

  app.get("/register", registerController);
  app.get("/login", loginController);
  app.get("/cart", isAuthenticated, getCartItems);

  app.post("/login", loginUser);
  app.get("/logout", logOut);
  app.post("/register", registerUser);

  app.post("/add-to-cart", isAuthenticated, addToCart);
  app.get("/check-login", checkLogin);
}

module.exports = initRoutes;
