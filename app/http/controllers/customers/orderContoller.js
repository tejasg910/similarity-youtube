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
        await data.save();
        res.redirect("/order");
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
    const orders = await Order.find({ customerId: customerId })
      .populate({
        path: "items.pizza",
        model: Menu,
      })
      .exec();
    orders.forEach((order) => {});
    res.render("customers/order", { orders: orders, moment: moment });
  } catch (error) {
    console.log(error.message);
    res.redirect("/");
  }
};
module.exports = { placeOrder, getOrderPage };
