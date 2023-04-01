const User = require("../../../models/User");

const getCartItems = async (req, res, next) => {
  const { _id } = req.user;
  const user = await User.findById(_id).populate("cart.pizza");
  const cartItems = user.cart;

  const total = user.cart.reduce((acc, cur) => {
    return acc + cur.pizza.price * cur.quantity;
  }, 0);

  console.log(cartItems);
  res.locals.itemCount = cartItems.length;

  res.render("customers/cart", {
    cart: cartItems,
    total,
  });
};

const clearCart = async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id);

  user.cart.splice(0, user.cart.length);
  await user.save();
  const cartItems = user.cart;
  const total = user.cart.reduce((acc, cur) => {
    return acc + cur.pizza.price * cur.quantity;
  }, 0);
  res.render("customers/cart", {
    cart: cartItems,
    total,
  });
};

const getCartLength = async (req, res) => {
  const itemCount = req.user.cart.reduce((acc, cur) => acc + cur.quantity, 0);

  res.status(200).json({ success: true, itemCount });
};

module.exports = { getCartItems, clearCart, getCartLength };
