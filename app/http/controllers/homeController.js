const Menu = require("../../models/menu");
const User = require("../../models/User");

const homePage = async (req, res, next) => {
  try {
    const data = await Menu.find({});

    res.render("home", { pizzas: data });
  } catch (error) {
    res.render("home", { success: false, pizzas: "No data found" });
  }
};

const getAllItems = async (req, res, next) => {
  next();
};

const addToCart = async (req, res, next) => {
  try {
    const { id } = req.body;
    const { _id, total } = req.user;

    const pizza = await Menu.findById(id);
    const userId = _id.toString();

    const cartItem = {
      pizza: pizza._id,
      quantity: 1,
    };

    const user = await User.findById(userId);

    // Check if the pizza is already in the cart
    const existingCartItem = user.cart.find((item) =>
      item.pizza.equals(pizza._id)
    );

    if (existingCartItem) {
      // If the pizza is already in the cart, increase the quantity
      existingCartItem.quantity += 1;
    } else {
      // If the pizza is not in the cart, add a new cart item
      user.cart.push(cartItem);
    }

    await user.save();

    res.status(200).json({ success: true, message: "Added to cart" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error adding to cart" });
  }
};

module.exports = { getAllItems, homePage, addToCart };
