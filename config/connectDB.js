const mongoose = require("mongoose");

async function connectDB() {
  try {
    await mongoose.connect("mongodb://0.0.0.0:27017/pizza");
    console.log("database connected succesfully");
  } catch (error) {}
}

module.exports = connectDB;
