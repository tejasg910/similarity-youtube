const getProfile = async (req, res, next) => {
  res.render("profile/profile", { user: req.user });
};
module.exports = {
  getProfile,
};
