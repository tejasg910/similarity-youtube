const bcrypt = require("bcrypt");
const isemail = require("isemail");

const axios = require("axios");
const nodemailer = require("nodemailer");
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

const forGotPassword = async (req, res, next) => {
  res.render("auth/forgotpassword");
};

async function sendVerificationEmail(req, res, next) {
  const { email } = req.body;
  console.log(email);
  const user = await User.findOne({ email });
  if (!user) {
    req.flash("message", "No user found with this email");
    return res.render("auth/forgotpassword", {
      message: "No account found with email",
    });
  }
  try {
    const valid = isemail.validate(email);
    console.log(valid); // true

    if (valid) {
      const otp = Math.floor(1000 + Math.random() * 9000);
      const transport = nodemailer.createTransport({
        host: "smtp-relay.sendinblue.com",
        port: 587,
        auth: {
          user: process.env.SENDINGBLUESMTPUSER,
          pass: process.env.SENDINGBLUESMTPPASSWORD,
        },
      });

      const mailOptions = {
        from: "tejasgiri910@gmail.com",
        to: email,
        subject: "Email Subject",
        html: `<p>Dear ,

Thank you for requesting a password reset. Your OTP for verification is: ${otp}. Please use this code to reset your password within the next 10 minutes. If you did not request this password reset, please ignore this email and contact our support team immediately.

Best regards,
Tejas Giri</p>`,
      };

      transport.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
        } else {
          req.session.email = email;
          console.log("Email sent: " + info.response);
          req.flash("message", "Email sent successfully");

          req.session.otp = otp;
          res.render("auth/forgotpassword", {
            message: "OTP sent successfully! Please check your email!",
          });
        }
      });
    } else {
      req.flash("message", "This is not valid email");
      res.redirect("/forgot");
    }
  } catch (error) {
    res.redirect("/forgot");
    console.log(error.message);
  }
}

const veriftyOtp = async (req, res, next) => {
  const { otpInput } = req.body;
  console.log(otpInput, req.session.otp);
  try {
    if (otpInput === req.session.otp.toString()) {
      req.session.otp = null;
      req.session.isAuthorized = true;

      console.log("otp is verfied");
      res.render("auth/changepassword", { message: "OTP is verified" });
    } else {
      req.flash("message", "OTP not matched");
      res.render("auth/forgotpassword", { message: "OTP is not matched" });
    }
  } catch (error) {
    res.render("auth/forgotpassword", { message: "Something went wrong" });
  }
};

const changePassword = async (req, res, next) => {
  const { password, cpassword } = req.body;
  console.log(password, cpassword);
  if (password !== cpassword) {
    req.flash("message", "password is not matching");
    return res.render("auth/changepassword");
  }

  if (req.session.isAuthorized && req.session.email) {
    req.session.isAuthorized = false;
    const hashed = await bcrypt.hash(password, 10);

    console.log(hashed);
    await User.findOneAndUpdate(
      { email: req.session.email },
      { password: hashed }
    );

    req.flash(
      "message",
      "Password changed successfully! Now enter new password"
    );
    return res.redirect("/login");
  } else {
    return res.render("auth/changepassword");
  }
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
  forGotPassword,
  sendVerificationEmail,
  veriftyOtp,
  changePassword,
};
