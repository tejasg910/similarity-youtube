const {
  registerController,
  loginController,
  registerUser,
  loginUser,
} = require("../app/http/controllers/authController");
const homeController = require("../app/http/controllers/homeController");
const path = require("path");
const User = require("../modals/User");

function initRoutes(app) {
  console.log(path.join(__dirname, "../resource/views"));
  app.set("views", path.join(__dirname, "../resource/views"));
  app.get("/", homeController().index);

  app.get("/register", registerController);
  app.get("/login", loginController);
  app.get("/cart", (req, res) => {
    res.render("customers/cart");
  });

  app.post("/login", loginUser);

  app.post("/register", registerUser);
}

module.exports = initRoutes;
