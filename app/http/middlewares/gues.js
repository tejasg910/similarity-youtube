const guest = (req, res, next) => {
  console.log(req.isAuthenticated());

  const { token } = req.cookies;
  if (!token) {
    return next();
  }

  return res.redirect("/");
};

module.exports = { guest };
