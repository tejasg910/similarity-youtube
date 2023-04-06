const guest = (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next();
  }

  return res.redirect("/");
};

module.exports = { guest };
