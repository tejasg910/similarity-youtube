const Order = require("../../../models/Order");
const User = require("../../../models/User");
const moment = require("moment");
const Menu = require("../../../models/menu");

const placeOrder = async (req, res, next) => {
  try {
    const { mobile, address } = req.body;
    const data = await User.findOne({ _id: req.user._id })
      .select("cart")
      .exec();
    const cart = data.cart;
    if (!mobile || !address) {
      req.flash("error", "All fields are required");
      return res.redirect("cart");
    }

    if (cart.length < 1) {
      req.flash("error", "Cart is empty");
      return res.redirect("cart");
    }

    const order = await Order.create({
      mobile,
      address,
      customerId: req.user._id,
      items: [...cart],
    });
    order
      .save()
      .then(async (result) => {
        data.cart.splice(0, data.cart.length);
        result = await Order.findOne({ _id: result._id })
          .populate({
            path: "customerId",
            select: "-password",
          })
          .populate({
            path: "items.pizza",
          })
          .exec();

        // req.flash("message", "Order placed successfully");
        await data.save();
        //emit

        const eventEmitter = req.app.get("eventEmitter");

        eventEmitter.emit("orderPlaced", result);
        res.json({ success: true, message: "Order placed successfully" });
        // return res.redirect("/order");
      })
      .catch((err) => {
        return res.render("customers/cart", {
          message: "Something went wrong!!!",
          cart: req.user.cart,
          total: 0,
        });
      });
  } catch (error) {
    return res.render("customers/cart", {
      message: "Something went wrong!!!",
      cart: req.user.cart,
      total: 0,
    });
  }
};

const getOrderPage = async (req, res, next) => {
  const customerId = req.user._id;

  try {
    const orders = await Order.find({ customerId: customerId }, null, {
      sort: { createdAt: -1 },
    })
      .populate({
        path: "items.pizza",
        model: Menu,
      })
      .exec();
    orders.forEach((order) => {});
    res.render("customers/order", { orders: orders, moment: moment });
  } catch (error) {
    res.redirect("/");
  }
};
module.exports = { placeOrder, getOrderPage };
