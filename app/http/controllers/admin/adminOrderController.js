const moment = require("moment");
const Order = require("../../../models/Order");
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: { $ne: "completed" } }, null, {
      sort: { createdAt: -1 },
    })
      .populate({
        path: "customerId",
        select: "-password",
      })
      .populate({
        path: "items.pizza",
      })
      .exec();
    if (req.xhr) {
      return res.status(200).json(orders);
    } else {
      return res.render("admin/orders", { orders, moment });
    }
  } catch (error) {
    res.redirect("/");
  }
};

module.exports = { getAdminOrders };
