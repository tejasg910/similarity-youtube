const {
  registerController,
  loginController,
  registerUser,
  loginUser,
  isAuthenticated,
  checkLogin,
  logOut,
  checkAuthentication,
  forGotPassword,
  sendVerificationEmail,
  veriftyOtp,
  changePassword,
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
const {
  placeOrder,
  getOrderPage,
} = require("../app/http/controllers/customers/orderContoller");
const { googleAuthenticate } = require("../app/config/passport");
const {
  googleAuthenticateCallback,
} = require("../app/config/googleAuthenticate");
const { isAdmin } = require("../app/http/middlewares/isAdmin");
const {
  getAdminOrders,
} = require("../app/http/controllers/admin/adminOrderController");
const {
  updateStatus,
} = require("../app/http/controllers/admin/statusCotroller");
const {
  showSingleOrder,
} = require("../app/http/controllers/customers/showSingleOrder");
const { doPayment } = require("../app/http/controllers/payment/stripe");

function initRoutes(app) {
  app.set("views", path.join(__dirname, "../resource/views"));
  app.get("/", homePage);

  app.get("/register", guest, registerController);
  app.get("/login", guest, loginController);
  app.get("/cart", isAuthenticated, getCartItems);

  app.post("/login", loginUser);
  app.get("/logout", isAuthenticated, logOut);
  app.post("/register", registerUser);
  app.get("/forgot", forGotPassword);
  app.post("/send-otp", sendVerificationEmail);
  app.post("/verify-otp", veriftyOtp);

  app.post("/change-password", changePassword);

  //customer routes
  app.post("/add-to-cart", checkAuthentication, addToCart);
  app.get("/clear-cart", isAuthenticated, clearCart);
  app.get("/check-login", checkLogin);
  app.get("/get-cart-length", isAuthenticated, getCartLength);
  app.get("/profile", isAuthenticated, getProfile);
  app.post("/order", isAuthenticated, placeOrder);
  app.get("/order", isAuthenticated, getOrderPage);
  app.get("/order/:id", isAuthenticated, showSingleOrder);
  //admin routes

  app.get("/admin/orders", isAuthenticated, isAdmin, getAdminOrders);

  app.post("/admin/order/status", isAuthenticated, isAdmin, updateStatus);

  //payment routes
  //initializing a payment

  app.get("/secret", doPayment);

  // Route to initiate Google authentication
  app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
  );

  // Route to handle Google authentication callback
  app.get("/auth/google/callback", googleAuthenticateCallback);
}

module.exports = initRoutes;
