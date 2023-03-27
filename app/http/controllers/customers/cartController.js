const User = require("../../../models/User");

const getCartItems = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("cart.pizza");
  const cartItems = user.cart;

  const total = user.cart.reduce((acc, cur) => {
    return acc + cur.pizza.price * cur.quantity;
  }, 0);

  res.render("customers/cart", { cart: cartItems, total });
};

module.exports = getCartItems;
