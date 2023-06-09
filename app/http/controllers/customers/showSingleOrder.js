const Order = require("../../../models/Order");

const showSingleOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (order.customerId.toString() === req.user._id.toString()) {
      return res.render("customers/singleOrder", { order });
    } else {
      return res.redirect("/");
    }
  } catch (error) {
    req.flash("error", "something went wrong!!!");
    return res.redirect("/");
  }
};

module.exports = { showSingleOrder };
