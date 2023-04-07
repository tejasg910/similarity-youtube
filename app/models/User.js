const mongoose = require("mongoose");

const usreSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    cart: [
      {
        pizza: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Pizza",
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    role: {
      type: String,
      default: "customer",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", usreSchema);
module.exports = User;
