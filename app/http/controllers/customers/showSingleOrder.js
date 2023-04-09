const Order = require("../../../models/Order");

const showSingleOrder = async (req, res, next) => {
  console.log("came in the show single page");
  const order = await Order.findById(req.params.id);
  try {
    if (order.customerId.toString() === req.user._id.toString()) {
      res.render("customers/singleOrder", { order });
    }
  } catch (error) {
    console.log(error.message);
    req.flash("error", "something went wrong!!!");
    res.redirect("/order");
  }
};

module.exports = { showSingleOrder };
