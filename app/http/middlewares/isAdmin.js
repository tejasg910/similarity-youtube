const User = require("../../models/User");

const isAdmin = async (req, res, next) => {
  const data = await User.findById(req.user._id);

  if (data.role === "admin") {
    return next();
  } else {
    req.flash("error", "You have not rights of admin");

    return res.redirect("/");
  }
};

module.exports = { isAdmin };
