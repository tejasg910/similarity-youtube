const User = require("../../models/User");

const isAdmin = async (req, res, next) => {
  const data = await User.findById(req.user._id);

  if (data.role === "admin") {
    console.log("you are admin");
    return next();
  } else {
    console.log("you are not admin");
    req.flash("error", "You have not rights of admin");

    return res.redirect("/");
  }
};

module.exports = { isAdmin };
