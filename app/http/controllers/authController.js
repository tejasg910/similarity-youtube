const User = require("../../../modals/User");
const bcrypt = require("bcrypt");
const { toast } = require("react-toastify");
const notifier = require("node-notifier");
const loginController = (req, res, next) => {
  res.render("auth/login");
};

const registerController = (req, res, next) => {
  res.render("auth/register");
};

const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user) {
    res
      .status(409)
      .json({ success: false, message: "This email is already exists" });
    return;
  }
  const hashed = await bcrypt.hash(password, 10);
  const data = await User.create({ username, email, password: hashed });
  // res
  //   .status(201)
  //   .json({ success: true, message: "Account created successfully" });

  res.redirect("/login");
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    notifier.notify("This email does not exists");
    res.render("auth/login");
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    notifier.notify("Invalid credentials");
    res.render("auth/login");
    return;
  }

  res.redirect("/?msg=success");
  return;
};

module.exports = {
  loginController,
  registerController,
  registerUser,
  loginUser,
};
