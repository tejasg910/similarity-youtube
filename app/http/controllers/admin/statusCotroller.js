const Order = require("../../../models/Order");

const updateStatus = async (req, res, next) => {
  try {
    const order = await Order.updateOne(
      { _id: req.body.orderId },
      { status: req.body.status }
    );

    const eventEmitter = req.app.get("eventEmitter");
    eventEmitter.emit("orderUpdated", {
      id: req.body.orderId,
      status: req.body.status,
    });
    return res.redirect("/admin/orders");
  } catch (error) {
    req.flash("Something went wrong");
    return res.redirect("/admin/orders");
  }
};

module.exports = { updateStatus };
