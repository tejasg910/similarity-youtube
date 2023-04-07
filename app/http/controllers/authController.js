const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const User = require("../../models/User");
const passport = require("passport");

const loginController = (req, res, next) => {
  res.render("auth/login");
};

const logOut = (req, res) => {
  try {
    res.clearCookie("token");
    req.session.user = null;
    res.render("auth/login", { success: true, message: "Log out successful" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const registerController = (req, res, next) => {
  res.render("auth/register");
};

const checkLogin = (req, res) => {
  const { token } = req.cookies;

  if (token) {
    res.status(200).json({ success: true, message: "Logged in" });
    return;
  } else {
    res.status(409).json({ success: false, message: "Not Logged in" });
    return;
  }
};

const isAuthenticated = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    if (token) {
      const decoded = jwt.verify(token, "ffsjlfsdljlsfjljfsdljfd");

      req.user = await User.findById(decoded.user);

      next();
    } else {
      res.redirect("/login");
      return;
    }
  } catch (error) {
    res.redirect("/login");
    return;
  }
};

const checkAuthentication = async (req, res, next) => {
  const { token } = req.cookies;
  try {
    if (token) {
      const decoded = jwt.verify(token, "ffsjlfsdljlsfjljfsdljfd");

      req.user = await User.findById(decoded.user);

      next();
    } else {
      res.status(409).json({ success: false, message: "You are not login" });
      return;
    }
  } catch (error) {
    res.status(500).json({ success: false, message: "something went wrong" });
    return;
  }
};

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!email || !password) {
    return res.render("auth/register", {
      message: req.flash("error", "All fields are required"),
    });
  }
  const user = await User.findOne({ email: email });

  if (user) {
    req.flash("error", "This email is already exists");

    return res.render("auth/register", {
      message: req.flash("error", "This email is already exists"),
    });
  }
  const hashed = await bcrypt.hash(password, 10);
  const data = await User.create({ username, email, password: hashed });
  // res
  //   .status(201)
  //   .json({ success: true, message: "Account created successfully" });

  res.redirect("/login");
};

const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email });

  if (!user) {
    res.render("auth/login", { message: "No email found" });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    res.render("auth/login", { message: "Invalid credentials" });
    return;
  }
  req.session.user = user;
  var token = await jwt.sign({ user }, "ffsjlfsdljlsfjljfsdljfd");
  res.cookie("token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  res.redirect("/");
  return;

  // passport.authenticate("local", (err, user, info) => {
  //   console.log(err, user, info);
  //   if (err) {
  //     req.flash("error", info.message);
  //     return next(err);
  //   }
  //   if (!user) {
  //     req.flash("error", info.message);
  //     return res.redirect("/login");
  //   }
  //   req.logIn(user, (err) => {
  //     if (err) {
  //       req.flash("error", info.message);
  //       return next(err);
  //     }
  //     console.log(user, "in the login in function");
  //     res.redirect("google.com");
  //     return;
  //   });
  // })(req, res, next);
};

module.exports = {
  loginController,
  registerController,
  registerUser,
  loginUser,
  isAuthenticated,
  checkLogin,
  logOut,
  checkAuthentication,
};
