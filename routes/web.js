const {
  registerController,
  loginController,
  registerUser,
  loginUser,
  isAuthenticated,
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

  app.post("/register", registerUser);

  app.post("/add-to-cart", isAuthenticated, addToCart);
}

module.exports = initRoutes;
